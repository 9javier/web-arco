import { ReceptionAvelonModel } from '../../../models/endpoints/receptions-avelon.model';

const marca: Array<ReceptionAvelonModel.Data> = [
  {
    id: 1,
    name: 'marca 1',
    selected: false
  },
  {
    id: 2,
    name: 'marca 2',
    selected: true
  },
  {
    id: 3,
    name: 'marca 3',
    selected: false
  },
  {
    id: 4,
    name: 'marca 4',
    selected: true
  },
  {
    id: 5,
    name: 'marca 5',
    selected: false
  },
  {
    id: 6,
    name: 'marca 6',
    selected: false
  },
  {
    id: 7,
    name: 'marca 7',
    selected: true
  },
  {
    id: 8,
    name: 'marca 8',
    selected: false
  },
  {
    id: 9,
    name: 'marca 9',
    selected: false
  },
  {
    id: 10,
    name: 'marca 10',
    selected: false
  },
];

const modelo: Array<ReceptionAvelonModel.Data> = [
  {
    id: 1,
    name: 'modelo 1',
    selected: true
  },
  {
    id: 2,
    name: 'modelo 2',
    selected: true
  },
  {
    id: 3,
    name: 'modelo 3',
    selected: false
  },
  {
    id: 4,
    name: 'modelo 4',
    selected: false
  },
  {
    id: 5,
    name: 'marca 5',
    selected: false
  },
  {
    id: 6,
    name: 'modelo 6',
    selected: false
  },
  {
    id: 7,
    name: 'modelo 7',
    selected: false
  },
  {
    id: 8,
    name: 'modelo 8',
    selected: false
  },
  {
    id: 9,
    name: 'modelo 9',
    selected: false
  },
  {
    id: 10,
    name: 'modelo 10',
    selected: true
  },
];

const colores: Array<ReceptionAvelonModel.Data> = [
  {
    id: 1,
    name: 'color 1',
    selected: true
  },
  {
    id: 2,
    name: 'color 2',
    selected: false
  },
  {
    id: 3,
    name: 'color 3',
    selected: false
  },
  {
    id: 4,
    name: 'color 4',
    selected: true
  },
  {
    id: 5,
    name: 'color 5',
    selected: true
  },
  {
    id: 6,
    name: 'color 6',
    selected: false
  },
  {
    id: 7,
    name: 'color 7',
    selected: true
  },
  {
    id: 8,
    name: 'color 8',
    selected: false
  },
  {
    id: 9,
    name: 'color 9',
    selected: false
  },
  {
    id: 10,
    name: 'color 10',
    selected: false
  },
];

const talla: Array<ReceptionAvelonModel.Data> = [
  {
    id: 1,
    name: 'talla 1',
    selected: true
  },
  {
    id: 2,
    name: 'talla 2',
    selected: false
  },
  {
    id: 3,
    name: 'talla 3',
    selected: false
  },
  {
    id: 4,
    name: 'talla 4',
    selected: true
  },
  {
    id: 5,
    name: 'talla 5',
    selected: true
  },
  {
    id: 6,
    name: 'talla 6',
    selected: false
  },
  {
    id: 7,
    name: 'talla 7',
    selected: true
  },
  {
    id: 8,
    name: 'talla 8',
    selected: false
  },
  {
    id: 9,
    name: 'talla 9',
    selected: false
  },
  {
    id: 10,
    name: 'talla 10',
    selected: false
  },
];


export const reception: ReceptionAvelonModel.Reception = {
  marca,
  modelo,
  colores,
  talla
}
