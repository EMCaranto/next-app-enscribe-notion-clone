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
