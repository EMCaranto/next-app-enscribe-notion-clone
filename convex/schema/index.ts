import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  document: defineTable({
    user_id: v.string(),
    title: v.string(),
    icon: v.optional(v.string()),
    cover_image: v.optional(v.string()),
    content: v.optional(v.string()),
    parent_document: v.optional(v.id('documents')),
    is_archived: v.boolean(),
    is_published: v.boolean(),
  })
    .index('by_user', ['user_id'])
    .index('by_user_parent', ['user_id', 'parent_document']),
});
