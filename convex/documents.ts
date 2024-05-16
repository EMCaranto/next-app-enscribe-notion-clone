// Convex
import { v } from 'convex/values';

import { Doc, Id } from './_generated/dataModel';
import { mutation, query } from './_generated/server';

export const getArchivedDocument = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Unauthenticated');
    }

    const userId = identity.subject;

    const document = await ctx.db
      .query('documents')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('isArchived'), true))
      .order('desc')
      .collect();

    return document;
  },
});

export const getDocumentById = query({
  args: { documentId: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const document = await ctx.db.get(args.documentId);

    if (!document) {
      throw new Error('Document not found');
    }

    if (document.isPublished && !document.isArchived) {
      return document;
    }

    if (!identity) {
      throw new Error('Unauthenticated');
    }

    const userId = identity.subject;

    if (document.userId !== userId) {
      throw new Error('Unauthorized');
    }

    return document;
  },
});

export const getSearchDocument = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Unauthenticated');
    }

    const userId = identity.subject;

    const document = await ctx.db
      .query('documents')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('isArchived'), false))
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
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Unauthenticated');
    }

    const userId = identity.subject;

    const document = await ctx.db
      .query('documents')
      .withIndex('by_user_parent', (q) =>
        q.eq('userId', userId).eq('parentDocument', args.parentDocument)
      )
      .filter((q) => q.eq(q.field('isArchived'), false))
      .order('desc')
      .collect();

    return document;
  },
});

export const onArchiveDocument = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Unauthenticated');
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error('Existing document not found');
    }

    if (existingDocument.userId !== userId) {
      throw new Error('Unauthorized');
    }

    const recursiveArchive = async (documentId: Id<'documents'>) => {
      const childDoc = await ctx.db
        .query('documents')
        .withIndex('by_user_parent', (q) =>
          q.eq('userId', userId).eq('parentDocument', documentId)
        )
        .collect();

      for (const child of childDoc) {
        await ctx.db.patch(child._id, {
          isArchived: true,
        });

        await recursiveArchive(child._id);
      }
    };

    const document = await ctx.db.patch(args.id, {
      isArchived: true,
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
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Unauthenticated');
    }

    const userId = identity.subject;

    const document = await ctx.db.insert('documents', {
      title: args.title,
      userId: userId,
      parentDocument: args.parentDocument,
      isPublished: false,
      isArchived: false,
    });

    return document;
  },
});

export const onDeleteDocument = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Unauthenticated');
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error('Existing document not found');
    }

    if (existingDocument.userId !== userId) {
      throw new Error('Unauthorized');
    }

    const document = await ctx.db.delete(args.id);

    return document;
  },
});

export const onRemoveCoverImage = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Unauthenticated');
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error('Existing document not found');
    }

    if (existingDocument.userId !== userId) {
      throw new Error('Unauthorized');
    }

    const document = await ctx.db.patch(args.id, {
      coverImage: undefined,
    });

    return document;
  },
});

export const onRemoveIcon = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Unauthenticated');
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error('Existing document not found');
    }

    if (existingDocument.userId !== userId) {
      throw new Error('Unauthorized');
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
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Unauthenticated');
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    const options: Partial<Doc<'documents'>> = {
      isArchived: false,
    };

    if (!existingDocument) {
      throw new Error('Existing document not found');
    }

    if (existingDocument.userId !== userId) {
      throw new Error('Unauthorized');
    }

    if (existingDocument.parentDocument) {
      const parentDoc = await ctx.db.get(existingDocument.parentDocument);

      if (parentDoc?.isArchived) {
        options.parentDocument = undefined;
      }
    }

    const recursiveRestore = async (documentId: Id<'documents'>) => {
      const childDoc = await ctx.db
        .query('documents')
        .withIndex('by_user_parent', (q) =>
          q.eq('userId', userId).eq('parentDocument', documentId)
        )
        .collect();

      for (const child of childDoc) {
        await ctx.db.patch(child._id, {
          isArchived: false,
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
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Unauthenticated');
    }

    const userId = identity.subject;

    const { id, ...rest } = args;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error('Existing document not found');
    }

    if (existingDocument.userId !== userId) {
      throw new Error('Unauthorized');
    }

    const document = await ctx.db.patch(args.id, {
      ...rest,
    });

    return document;
  },
});
