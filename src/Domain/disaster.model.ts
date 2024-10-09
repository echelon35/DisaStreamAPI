import { Point } from 'geojson';
import { Source } from './source.model';

export class Disaster {
  id: number;
  premier_releve: Date;
  dernier_releve: Date;
  point: Point;
  source: Source;
  idFromSource: string;
  lien_source: string;
  nb_ressenti: number;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}
