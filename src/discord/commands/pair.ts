import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { createPair } from "../../db";
import { log } from "../../util";

export default {
  data: new SlashCommandBuilder()
    .setName("pair")
    .setDescription("Pair role with YouTube channel")
    .addStringOption((option) =>
      option
        .setName("channel")
        .setDescription("YouTube Channel ID")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role to tired with")
        .setRequired(true)
    ),
  async execute(intr: CommandInteraction) {
    await assertValidModerator(intr);

    const guild = intr.guild;
    if (!guild) return log("!guild");

    const channel = intr.options.getString("channel")!;
    const role = intr.options.getRole("role")!;

    console.log("channel:", channel, "roleName:", role);

    const pair = await createPair({
      guildId: guild.id,
      roleId: role.id,
      originChannelId: channel,
    });
    log(pair);

    intr.reply({
      content: `Success:
Role: \`${role.name}\`
Channel: https://www.youtube.com/channel/${channel}`,
    });
  },
};

async function assertValidModerator(intr: CommandInteraction) {
  if (!(intr.channel && intr.channel.type === "GUILD_TEXT")) {
    throw new Error("Invalid channel");
  }

  const hasPermission =
    intr.channel.permissionsFor(intr.user)?.has("MANAGE_CHANNELS") ?? false;

  if (!hasPermission) {
    throw new Error("You are not allowed to run this command");
  }
}
