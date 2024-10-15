import { Geometry } from 'geojson';
import { Alea } from 'src/Domain/alea.model';

export class CreateAlertDto {
  areas: Geometry;
  name: string;
  aleas: Alea[];
}
