#!/usr/bin/env node

const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// 設定（環境変数で上書き）
const CONFIG = {
  metaAccountId: process.env.META_ACCOUNT_ID || "2897156057128787",
  slackChannelId: process.env.SLACK_CHANNEL_ID || "C0B3W49LSGZ",
  slackThreadTs: process.env.SLACK_THREAD_TS || "1782195718.888059",
  slackUserMention: process.env.SLACK_USER_MENTION || "U06U8RQC6CQ",
};

async function main() {
  try {
    console.log(
      `📊 Fetching Meta cost for account ${CONFIG.metaAccountId}...`
    );

    // AdPost で昨日のコスト取得 & Slack投げ
    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `アンテプリマのMeta広告アカウント（ID: ${CONFIG.metaAccountId}）の昨日のコスト（spend）だけを取得して、Slackの「${CONFIG.slackChannelId}」スレッド「${CONFIG.slackThreadTs}」に メンション付きで投げてください。フォーマットは「昨日のコスト: ¥X,XXX」シンプルに。メンション: <@${CONFIG.slackUserMention}>`,
        },
      ],
    });

    console.log("✓ Report sent");
    console.log(message.content[0]);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

main();
