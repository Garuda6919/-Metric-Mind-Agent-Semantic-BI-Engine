-- ============================================================
-- MetricMind - Snowflake Environment Setup
-- ============================================================

USE ROLE SYSADMIN;

-- Compute warehouse
CREATE WAREHOUSE IF NOT EXISTS METRICMIND_WH
    WAREHOUSE_SIZE = 'XSMALL'
    AUTO_SUSPEND = 60
    AUTO_RESUME = TRUE
    INITIALLY_SUSPENDED = TRUE;

-- Project database
CREATE DATABASE IF NOT EXISTS METRICMIND_DB;

USE DATABASE METRICMIND_DB;

-- Source/raw data
CREATE SCHEMA IF NOT EXISTS RAW;

-- dbt-managed cleaned models
CREATE SCHEMA IF NOT EXISTS STAGING;

-- Analytics-ready models
CREATE SCHEMA IF NOT EXISTS MART;

-- Set context
USE WAREHOUSE METRICMIND_WH;
USE SCHEMA RAW;