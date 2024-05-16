import { v } from 'convex/values';

import { Doc, Id } from '../_generated/dataModel';
import { mutation, query } from '../_generated/server';

export const createDocument = mutation({
  args: {
    title: v.string(),
    parent_document: v.optional(v.id('documents')),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('[Create Document] - Unauthenticated');
    }

    const userId = user.subject;

    const document = await ctx.db.insert('documents', {
      user_id: userId,
      title: args.title,
      parent_document: args.parent_document,
      is_archived: false,
      is_published: false,
    });

    return document;
  },
});

export const getArchivedDocument = query({
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('[Get Archived Document] - Unauthenticated');
    }

    const userId = user.subject;

    const document = await ctx.db
      .query('documents')
      .withIndex('by_user', (q) => q.eq('user_id', userId))
      .filter((q) => q.eq(q.field('is_archived'), true))
      .order('desc')
      .collect();

    return document;
  },
});

export const getDocumentById = query({
  args: { documentId: v.id('documents') },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    const document = await ctx.db.get(args.documentId);

    if (!document) {
      throw new Error('[Get Document By Id] - Document not found');
    }

    if (document.is_published && !document.is_archived) {
      return document;
    }

    if (!user) {
      throw new Error('[Get Document By Id] - Unauthenticated');
    }

    const userId = user.subject;

    if (document.user_id !== userId) {
      throw new Error('[Get Document By Id] - Unauthorized');
    }

    return document;
  },
});

export const getSearchDocument = query({
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('[Get Search Document] - Unauthenticated');
    }

    const userId = user.subject;

    const document = await ctx.db
      .query('documents')
      .withIndex('by_user', (q) => q.eq('user_id', userId))
      .filter((q) => q.eq(q.field('is_archived'), false))
      .order('desc')
      .collect();

    return document;
  },
});

export const getSidebarDocument = query({
  args: {
    parentDocument: v.optional(v.id('documents')),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('[Get Sidebar Document] - Unauthenticated');
    }

    const userId = user.subject;

    const document = await ctx.db
      .query('documents')
      .withIndex('by_user_parent', (q) =>
        q.eq('user_id', userId).eq('parent_document', args.parentDocument)
      )
      .filter((q) => q.eq(q.field('is_archived'), false))
      .order('desc')
      .collect();
  },
});

export const archiveDocument = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('[Archive Document] - Unauthenticated');
    }

    const userId = user.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error('[Archive Document] - Existing document not found');
    }

    if (existingDocument.user_id !== userId) {
      throw new Error('[Archive Document] - Unauthorized');
    }

    const recursiveArchive = async (documentId: Id<'documents'>) => {
      const childDocument = await ctx.db
        .query('documents')
        .withIndex('by_user_parent', (q) =>
          q.eq('user_id', userId).eq('parent_document', documentId)
        )
        .collect();

      for (const child of childDocument) {
        await ctx.db.patch(child._id, {
          is_archived: true,
        });

        await recursiveArchive(child._id);
      }
    };

    const document = await ctx.db.patch(args.id, {
      is_archived: true,
    });

    recursiveArchive(args.id);

    return document;
  },
});

export const deleteDocument = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('[Delete Document] - Unauthenticated');
    }

    const userId = user.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error('[Delete Document] - Existing document not found');
    }

    if (existingDocument.user_id !== userId) {
      throw new Error('[Delete Document] - Unauthorized');
    }

    const document = await ctx.db.delete(args.id);

    return document;
  },
});

export const removeCoverImage = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('[Remove Cover Image] - Unauthenticated');
    }

    const userId = user.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error('[Remove Cover Image] - Existing document not found');
    }

    if (existingDocument.user_id !== userId) {
      throw new Error('[Remove Cover Image] - Unauthorized');
    }

    const document = await ctx.db.patch(args.id, {
      cover_image: undefined,
    });

    return document;
  },
});

export const removeIcon = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('[Remove Icon] - Unauthenticated');
    }

    const userId = user.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error('[Remove Icon] - Existing document not found');
    }

    if (existingDocument.user_id !== userId) {
      throw new Error('[Remove Icon] - Unauthorized');
    }

    const document = await ctx.db.patch(args.id, {
      icon: undefined,
    });

    return document;
  },
});
