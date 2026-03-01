-- ─────────────────────────────────────────────────────────────────────────────
-- SkieZ Fresh Farm — Finance Schema
-- Run this in Supabase SQL Editor AFTER schema.sql and admin_setup.sql
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── Finance Records table ────────────────────────────────────────────────────
create table if not exists finance_records (
    id             uuid         primary key default uuid_generate_v4(),
    record_date    date         not null default current_date,
    product_name   text         not null,
    category       text,
    quantity       numeric      not null default 1,
    unit_price     int          not null,        -- UGX
    total_amount   int          not null,        -- UGX (qty × unit_price)
    payment_method text         default 'cash'
                                check (payment_method in ('cash','mobile_money','bank_transfer','credit')),
    notes          text,
    created_by     uuid         references auth.users(id) on delete set null,
    created_at     timestamptz  default now()
);

-- RLS
alter table finance_records enable row level security;

-- Only admins can read/write finance records
create policy "Admins can read finance records"
    on finance_records for select
    using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can insert finance records"
    on finance_records for insert
    with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can update finance records"
    on finance_records for update
    using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can delete finance records"
    on finance_records for delete
    using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- ─── Useful analytics views ───────────────────────────────────────────────────

-- Daily revenue view (last 90 days)
create or replace view finance_daily_summary as
select
    record_date,
    count(*)                    as transaction_count,
    sum(total_amount)           as total_revenue,
    sum(quantity)               as total_items_sold,
    avg(total_amount)           as avg_transaction
from finance_records
where record_date >= current_date - interval '90 days'
group by record_date
order by record_date;

-- Top products view
create or replace view finance_top_products as
select
    product_name,
    category,
    sum(quantity)               as total_qty,
    sum(total_amount)           as total_revenue,
    count(*)                    as transaction_count
from finance_records
group by product_name, category
order by total_revenue desc
limit 20;

-- Monthly summary view
create or replace view finance_monthly_summary as
select
    date_trunc('month', record_date)  as month,
    to_char(record_date, 'Mon YYYY')  as month_label,
    count(*)                           as transaction_count,
    sum(total_amount)                  as total_revenue,
    sum(quantity)                      as total_items_sold
from finance_records
group by date_trunc('month', record_date), to_char(record_date, 'Mon YYYY')
order by month;
