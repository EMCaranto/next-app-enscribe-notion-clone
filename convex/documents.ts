import { v } from 'convex/values';

import { Doc, Id } from './_generated/dataModel';
import { mutation, query } from './_generated/server';

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

    return document;
  },
});

export const onArchiveDocument = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('[On Archive Document] - Unauthenticated');
    }

    const userId = user.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error('[On Archive Document] - Existing document not found');
    }

    if (existingDocument.user_id !== userId) {
      throw new Error('[On Archive Document] - Unauthorized');
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

export const onCreateDocument = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id('documents')),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('[On Create Document] - Unauthenticated');
    }

    const userId = user.subject;

    const document = await ctx.db.insert('documents', {
      title: args.title,
      user_id: userId,
      parent_document: args.parentDocument,
      is_published: false,
      is_archived: false,
    });

    return document;
  },
});

export const onDeleteDocument = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('[On Delete Document] - Unauthenticated');
    }

    const userId = user.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error('[On Delete Document] - Existing document not found');
    }

    if (existingDocument.user_id !== userId) {
      throw new Error('[On Delete Document] - Unauthorized');
    }

    const document = await ctx.db.delete(args.id);

    return document;
  },
});

export const onRemoveCoverImage = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('[On Remove Cover Image] - Unauthenticated');
    }

    const userId = user.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error('[On Remove Cover Image] - Existing document not found');
    }

    if (existingDocument.user_id !== userId) {
      throw new Error('[On Remove Cover Image] - Unauthorized');
    }

    const document = await ctx.db.patch(args.id, {
      cover_image: undefined,
    });

    return document;
  },
});

export const onRemoveIcon = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('[On Remove Icon] - Unauthenticated');
    }

    const userId = user.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error('[On Remove Icon] - Existing document not found');
    }

    if (existingDocument.user_id !== userId) {
      throw new Error('[On Remove Icon] - Unauthorized');
    }

    const document = await ctx.db.patch(args.id, {
      icon: undefined,
    });

    return document;
  },
});

export const onRestoreDocument = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('[On Restore Document] - Unauthenticated');
    }

    const userId = user.subject;

    const existingDocument = await ctx.db.get(args.id);

    const options: Partial<Doc<'documents'>> = {
      is_archived: false,
    };

    if (!existingDocument) {
      throw new Error('[On Restore Document] - Existing document not found');
    }

    if (existingDocument.user_id !== userId) {
      throw new Error('[On Restore Document] - Unauthorized');
    }

    if (existingDocument.parent_document) {
      const parentDocument = await ctx.db.get(existingDocument.parent_document);

      if (parentDocument?.is_archived) {
        options.parent_document = undefined;
      }
    }

    const recursiveRestore = async (documentId: Id<'documents'>) => {
      const childDocument = await ctx.db
        .query('documents')
        .withIndex('by_user_parent', (q) =>
          q.eq('user_id', userId).eq('parent_document', documentId)
        )
        .collect();

      for (const child of childDocument) {
        await ctx.db.patch(child._id, {
          is_archived: false,
        });

        await recursiveRestore(child._id);
      }
    };

    const document = await ctx.db.patch(args.id, options);

    recursiveRestore(args.id);

    return document;
  },
});

export const onUpdateDocument = mutation({
  args: {
    id: v.id('documents'),
    title: v.optional(v.string()),
    icon: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    content: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('[On Update Document] - Unauthenticated');
    }

    const userId = user.subject;

    const { id, ...rest } = args;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error('[On Update Document] - Existing document not found');
    }

    if (existingDocument.user_id !== userId) {
      throw new Error('[On Update Document] - Unauthorized');
    }

    const document = await ctx.db.patch(args.id, {
      ...rest,
    });

    return document;
  },
});
