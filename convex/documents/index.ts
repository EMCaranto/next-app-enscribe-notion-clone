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
