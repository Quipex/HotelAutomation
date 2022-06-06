import { ClientDto } from '~/common/types';
import BriefClientMessage from './BriefClient';

function DetailedClientMessage(
  client: ClientDto
): string {
  const { country, city, address, email } = client;
  return (
    BriefClientMessage(
      client,
      (email ? `Имейл: ${email}\n` : '')
      + (country ? `Страна: ${country}\n` : '')
      + (city ? `Город: ${city}\n` : '')
      + (address ? `Адрес: ${address}\n` : '')
    )
  );
}

export default DetailedClientMessage;
