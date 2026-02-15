# DB Migration (Init V1) — Supabase

This runtime cannot reach Supabase directly (Prisma P1001). To bootstrap the DB anyway, we generate a SQL migration from the Prisma schema and apply it in Supabase.

## File
- `prisma/migration_init_v1.sql`

## Apply in Supabase
1) Open Supabase project → **SQL Editor**
2) New query → paste the whole SQL from `prisma/migration_init_v1.sql`
3) Run

## Notes
- This creates enums + tables + indexes + FKs.
- It does **not** create RLS policies yet.

## Next
After SQL is applied, we can:
- add RLS policies
- wire NextAuth adapter
- start writing cron jobs (collect/score/social-kit)
