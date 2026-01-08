-- OpenDotDB Database Optimization Script
-- Run this script to optimize your PostgreSQL database for better performance

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;  -- For fuzzy text search
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;  -- For query performance monitoring

-- Additional indexes for better search performance
-- These indexes improve full-text search and pattern matching

-- Trigram indexes for fuzzy matching
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_domain_name_trgm
ON "Domain" USING gin (name gin_trgm_ops);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_domain_sld_trgm
ON "Domain" USING gin (sld gin_trgm_ops);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_keyword_word_trgm
ON "Keyword" USING gin (word gin_trgm_ops);

-- Composite indexes for common query patterns
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_domain_tld_createdat
ON "Domain" (tld, "createdAt" DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_domain_status_createdat
ON "Domain" (status, "createdAt" DESC)
WHERE status IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_keyword_searchvolume_desc
ON "Keyword" ("searchVolume" DESC)
WHERE "searchVolume" > 0;

-- Indexes for monitoring and analytics
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_domainmonitor_userid_isactive
ON "DomainMonitor" ("userId", "isActive")
WHERE "userId" IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_keywordtrend_date_desc
ON "KeywordTrend" (date DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_keywordtrend_keyword_date
ON "KeywordTrend" ("keywordId", date DESC);

-- Partial indexes for common filters
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_domain_active
ON "Domain" ("createdAt" DESC)
WHERE status = 'active';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_monitor_active
ON "DomainMonitor" ("lastChecked" DESC)
WHERE "isActive" = true;

-- Update table statistics for better query planning
ANALYZE "Domain";
ANALYZE "Keyword";
ANALYZE "DomainKeyword";
ANALYZE "KeywordTrend";
ANALYZE "DomainMonitor";
ANALYZE "DomainChange";
ANALYZE "DomainStatistic";
ANALYZE "TldStatistic";

-- Vacuum tables to reclaim space and update statistics
VACUUM ANALYZE "Domain";
VACUUM ANALYZE "Keyword";
VACUUM ANALYZE "DomainKeyword";
VACUUM ANALYZE "KeywordTrend";

-- View to show index usage statistics
CREATE OR REPLACE VIEW index_usage_stats AS
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan as scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched,
    pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;

-- View to show table sizes
CREATE OR REPLACE VIEW table_sizes AS
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) as indexes_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Function to update keyword trends (call this daily via cron)
CREATE OR REPLACE FUNCTION update_keyword_trends()
RETURNS void AS $$
DECLARE
    keyword_record RECORD;
    current_count INTEGER;
    previous_count INTEGER;
BEGIN
    FOR keyword_record IN SELECT id FROM "Keyword" LOOP
        -- Count domains with this keyword
        SELECT COUNT(*) INTO current_count
        FROM "DomainKeyword"
        WHERE "keywordId" = keyword_record.id;

        -- Get previous count
        SELECT "domainCount" INTO previous_count
        FROM "KeywordTrend"
        WHERE "keywordId" = keyword_record.id
        ORDER BY date DESC
        LIMIT 1;

        -- Insert new trend record
        INSERT INTO "KeywordTrend" ("id", "keywordId", date, "domainCount", "newDomains")
        VALUES (
            gen_random_uuid()::text,
            keyword_record.id,
            CURRENT_DATE,
            current_count,
            GREATEST(0, current_count - COALESCE(previous_count, 0))
        )
        ON CONFLICT ("keywordId", date)
        DO UPDATE SET
            "domainCount" = EXCLUDED."domainCount",
            "newDomains" = EXCLUDED."newDomains";
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to update TLD statistics
CREATE OR REPLACE FUNCTION update_tld_statistics()
RETURNS void AS $$
DECLARE
    tld_record RECORD;
    total_count INTEGER;
    previous_count INTEGER;
BEGIN
    FOR tld_record IN SELECT DISTINCT tld FROM "Domain" LOOP
        -- Count total domains for this TLD
        SELECT COUNT(*) INTO total_count
        FROM "Domain"
        WHERE tld = tld_record.tld;

        -- Get previous count
        SELECT "totalDomains" INTO previous_count
        FROM "TldStatistic"
        WHERE tld = tld_record.tld;

        -- Upsert TLD statistic
        INSERT INTO "TldStatistic" ("id", tld, "totalDomains", "newDomains", date, "updatedAt")
        VALUES (
            gen_random_uuid()::text,
            tld_record.tld,
            total_count,
            GREATEST(0, total_count - COALESCE(previous_count, 0)),
            CURRENT_DATE,
            NOW()
        )
        ON CONFLICT (tld)
        DO UPDATE SET
            "totalDomains" = EXCLUDED."totalDomains",
            "newDomains" = EXCLUDED."newDomains",
            date = EXCLUDED.date,
            "updatedAt" = EXCLUDED."updatedAt";
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Helpful queries for monitoring

-- Show slow queries (requires pg_stat_statements)
-- SELECT query, calls, total_time, mean_time, max_time
-- FROM pg_stat_statements
-- ORDER BY mean_time DESC
-- LIMIT 10;

-- Show largest tables
-- SELECT * FROM table_sizes;

-- Show index usage
-- SELECT * FROM index_usage_stats;

-- Show unused indexes
-- SELECT * FROM index_usage_stats WHERE scans = 0;

COMMENT ON FUNCTION update_keyword_trends IS 'Updates keyword trends daily. Run via cron: 0 1 * * * psql -d opendotdb -c "SELECT update_keyword_trends();"';
COMMENT ON FUNCTION update_tld_statistics IS 'Updates TLD statistics. Run via cron: 0 2 * * * psql -d opendotdb -c "SELECT update_tld_statistics();"';
