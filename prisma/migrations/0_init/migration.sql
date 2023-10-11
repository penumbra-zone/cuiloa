-- CreateTable
CREATE TABLE "attributes" (
    "event_id" BIGINT NOT NULL,
    "key" VARCHAR NOT NULL,
    "composite_key" VARCHAR NOT NULL,
    "value" VARCHAR
);

-- CreateTable
CREATE TABLE "blocks" (
    "rowid" BIGSERIAL NOT NULL,
    "height" BIGINT NOT NULL,
    "chain_id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "blocks_pkey" PRIMARY KEY ("rowid")
);

-- CreateTable
CREATE TABLE "events" (
    "rowid" BIGSERIAL NOT NULL,
    "block_id" BIGINT NOT NULL,
    "tx_id" BIGINT,
    "type" VARCHAR NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("rowid")
);

-- CreateTable
CREATE TABLE "tx_results" (
    "rowid" BIGSERIAL NOT NULL,
    "block_id" BIGINT NOT NULL,
    "index" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "tx_hash" VARCHAR NOT NULL,
    "tx_result" BYTEA NOT NULL,

    CONSTRAINT "tx_results_pkey" PRIMARY KEY ("rowid")
);

-- CreateIndex
CREATE UNIQUE INDEX "attributes_event_id_key_key" ON "attributes"("event_id", "key");

-- CreateIndex
CREATE INDEX "idx_blocks_height_chain" ON "blocks"("height", "chain_id");

-- CreateIndex
CREATE UNIQUE INDEX "blocks_height_chain_id_key" ON "blocks"("height", "chain_id");

-- CreateIndex
CREATE UNIQUE INDEX "tx_results_block_id_index_key" ON "tx_results"("block_id", "index");

-- AddForeignKey
ALTER TABLE "attributes" ADD CONSTRAINT "attributes_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("rowid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_block_id_fkey" FOREIGN KEY ("block_id") REFERENCES "blocks"("rowid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_tx_id_fkey" FOREIGN KEY ("tx_id") REFERENCES "tx_results"("rowid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tx_results" ADD CONSTRAINT "tx_results_block_id_fkey" FOREIGN KEY ("block_id") REFERENCES "blocks"("rowid") ON DELETE NO ACTION ON UPDATE NO ACTION;

