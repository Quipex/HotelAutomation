import { CallbackHandler } from '../../CallbackHandler';

const cancelAction: CallbackHandler = async ({ ctx, messageId }) => {
  await ctx.answerCbQuery('Отменено ❌');
  await ctx.deleteMessage(messageId);
};

export { cancelAction };
