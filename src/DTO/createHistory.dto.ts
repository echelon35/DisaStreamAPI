import { Alert } from 'src/Domain/alert.model';
import { DisasterDataFromSQS } from './disasterDataFromSQS';

export class CreateHistoryDto {
  alert: Alert;
  notification: JSON;
  disasterDataFromSQS: DisasterDataFromSQS;
}
