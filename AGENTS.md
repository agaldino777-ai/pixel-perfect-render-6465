<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules

- Public pages (`/`, `/montar-plano`, `/obrigado`, `/auth`) are top-level routes; every admin page lives under `src/routes/_authenticated/admin*` — the auth gate must cover the whole panel.
- Data access goes through the browser Supabase client with RLS; admin rights are checked with the `has_role(uid,'admin')` function so policies never read roles from a profile table.
- The first signed-in account claims the admin role via the `claim_admin()` database function — keeps the MVP usable without a seeded password.
- A database trigger on `visitas` writes `aparelhos.ultima_limpeza` when a visit is marked "feita", so the reminder math has a single source of truth.
