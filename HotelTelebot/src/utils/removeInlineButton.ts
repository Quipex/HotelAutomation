import { TelegrafContext } from 'telegraf/typings/context';

async function removeInlineButton(ctx: TelegrafContext, originalMessageId: number, callbackDataListToRemove: string[]) {
  const message = ctx.update.callback_query.message as any;
  const repliesWithoutConfirmation = message.reply_markup.inline_keyboard
    .filter(mkRow => !callbackDataListToRemove.find(cd => mkRow[0].callback_data === cd));
  await ctx.telegram.editMessageText(ctx.chat!.id, originalMessageId, null as any, message.text, {
    reply_markup: { inline_keyboard: repliesWithoutConfirmation }
  });
}

export default removeInlineButton;
