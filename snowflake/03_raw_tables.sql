USE DATABASE METRICMIND_DB;
USE SCHEMA RAW;

CREATE OR REPLACE TABLE RAW.CUSTOMERS (
    customer_id VARCHAR,
    customer_unique_id VARCHAR,
    customer_zip_code_prefix NUMBER,
    customer_city VARCHAR,
    customer_state VARCHAR
);

CREATE OR REPLACE TABLE RAW.CUSTOMERS (
    customer_id VARCHAR,
    customer_unique_id VARCHAR,
    customer_zip_code_prefix NUMBER,
    customer_city VARCHAR,
    customer_state VARCHAR
);

CREATE OR REPLACE TABLE RAW.ORDERS (
    order_id VARCHAR,
    customer_id VARCHAR,
    order_status VARCHAR,
    order_purchase_timestamp TIMESTAMP_NTZ,
    order_approved_at TIMESTAMP_NTZ,
    order_delivered_carrier_date TIMESTAMP_NTZ,
    order_delivered_customer_date TIMESTAMP_NTZ,
    order_estimated_delivery_date TIMESTAMP_NTZ
);

CREATE OR REPLACE TABLE RAW.ORDER_ITEMS (
    order_id VARCHAR,
    order_item_id NUMBER,
    product_id VARCHAR,
    seller_id VARCHAR,
    shipping_limit_date TIMESTAMP_NTZ,
    price NUMBER(12,2),
    freight_value NUMBER(12,2)
);

CREATE OR REPLACE TABLE RAW.ORDER_PAYMENTS (
    order_id VARCHAR,
    payment_sequential NUMBER,
    payment_type VARCHAR,
    payment_installments NUMBER,
    payment_value NUMBER(12,2)
);

CREATE OR REPLACE TABLE RAW.ORDER_REVIEWS (
    review_id VARCHAR,
    order_id VARCHAR,
    review_score NUMBER,
    review_comment_title VARCHAR,
    review_comment_message VARCHAR,
    review_creation_date TIMESTAMP_NTZ,
    review_answer_timestamp TIMESTAMP_NTZ
);

CREATE OR REPLACE TABLE RAW.PRODUCTS (
    product_id VARCHAR,
    product_category_name VARCHAR,
    product_name_length NUMBER,
    product_description_length NUMBER,
    product_photos_qty NUMBER,
    product_weight_g NUMBER,
    product_length_cm NUMBER,
    product_height_cm NUMBER,
    product_width_cm NUMBER
);

CREATE OR REPLACE TABLE RAW.SELLERS (
    seller_id VARCHAR,
    seller_zip_code_prefix NUMBER,
    seller_city VARCHAR,
    seller_state VARCHAR
);

CREATE OR REPLACE TABLE RAW.GEOLOCATION (
    geolocation_zip_code_prefix NUMBER,
    geolocation_lat FLOAT,
    geolocation_lng FLOAT,
    geolocation_city VARCHAR,
    geolocation_state VARCHAR
);

CREATE OR REPLACE TABLE RAW.CATEGORY_TRANSLATION (
    product_category_name VARCHAR,
    product_category_name_english VARCHAR
);

SHOW TABLES IN SCHEMA RAW;