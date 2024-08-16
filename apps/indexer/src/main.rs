use anyhow::Result;
use clap::Parser;
use indexer::block_events::BlockEvents;
use cometindex::{Indexer, opt::Options};

#[tokio::main]
async fn main() -> Result<()> {
    Indexer::new(Options::parse())
        .with_default_tracing()
        .with_index(BlockEvents {})
        .run()
        .await?;

    Ok(())
}
