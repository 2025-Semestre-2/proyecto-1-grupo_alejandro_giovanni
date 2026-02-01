const COSTA_RICA_LOCATIONS = [
  {
    id: 1,
    name: "San José",
    cantons: [
      {
        id: 1,
        name: "Central",
        districts: [
          { id: 1, name: "Carmen" },
          { id: 2, name: "Merced" },
          { id: 3, name: "Hospital" },
          { id: 4, name: "Catedral" },
          { id: 5, name: "Zapote" },
        ],
      },
      {
        id: 2,
        name: "Escazú",
        districts: [
          { id: 6, name: "Escazú" },
          { id: 7, name: "San Antonio" },
          { id: 8, name: "San Rafael" },
          { id: 9, name: "San Miguel" },
          { id: 10, name: "San José de la Montaña" },
        ],
      },
      {
        id: 3,
        name: "Desamparados",
        districts: [
          { id: 11, name: "Desamparados" },
          { id: 12, name: "San Miguel" },
          { id: 13, name: "San Juan de Dios" },
          { id: 14, name: "San Rafael Arriba" },
          { id: 15, name: "San Antonio" },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Alajuela",
    cantons: [
      {
        id: 4,
        name: "Alajuela",
        districts: [
          { id: 16, name: "Alajuela" },
          { id: 17, name: "San José" },
          { id: 18, name: "Carrizal" },
          { id: 19, name: "San Antonio" },
          { id: 20, name: "San Isidro" },
        ],
      },
      {
        id: 5,
        name: "Grecia",
        districts: [
          { id: 21, name: "Grecia" },
          { id: 22, name: "San Isidro" },
          { id: 23, name: "San José" },
          { id: 24, name: "San Roque" },
          { id: 25, name: "Tacares" },
        ],
      },
      {
        id: 6,
        name: "San Ramón",
        districts: [
          { id: 26, name: "San Ramón" },
          { id: 27, name: "Santiago" },
          { id: 28, name: "San Juan" },
          { id: 29, name: "Piedades Norte" },
          { id: 30, name: "Piedades Sur" },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Cartago",
    cantons: [
      {
        id: 7,
        name: "Cartago",
        districts: [
          { id: 31, name: "Oriental" },
          { id: 32, name: "Occidental" },
          { id: 33, name: "Carmen" },
          { id: 34, name: "San Nicolás" },
          { id: 35, name: "Aguacaliente" },
        ],
      },
      {
        id: 8,
        name: "Paraíso",
        districts: [
          { id: 36, name: "Paraíso" },
          { id: 37, name: "Santiago" },
          { id: 38, name: "Orosi" },
          { id: 39, name: "Cachí" },
          { id: 40, name: "Llanos de Santa Lucía" },
        ],
      },
      {
        id: 9,
        name: "La Unión",
        districts: [
          { id: 41, name: "Tres Ríos" },
          { id: 42, name: "San Diego" },
          { id: 43, name: "San Juan" },
          { id: 44, name: "San Rafael" },
          { id: 45, name: "Concepción" },
        ],
      },
    ],
  },
  {
    id: 4,
    name: "Heredia",
    cantons: [
      {
        id: 10,
        name: "Heredia",
        districts: [
          { id: 46, name: "Heredia" },
          { id: 47, name: "Mercedes" },
          { id: 48, name: "San Francisco" },
          { id: 49, name: "Ulloa" },
          { id: 50, name: "Varablanca" },
        ],
      },
      {
        id: 11,
        name: "Barva",
        districts: [
          { id: 51, name: "Barva" },
          { id: 52, name: "San Pedro" },
          { id: 53, name: "San Pablo" },
          { id: 54, name: "San Roque" },
          { id: 55, name: "Santa Lucía" },
        ],
      },
      {
        id: 12,
        name: "Santo Domingo",
        districts: [
          { id: 56, name: "Santo Domingo" },
          { id: 57, name: "San Vicente" },
          { id: 58, name: "San Miguel" },
          { id: 59, name: "Paracito" },
          { id: 60, name: "Santo Tomás" },
        ],
      },
    ],
  },
  {
    id: 5,
    name: "Guanacaste",
    cantons: [
      {
        id: 13,
        name: "Liberia",
        districts: [
          { id: 61, name: "Liberia" },
          { id: 62, name: "Cañas Dulces" },
          { id: 63, name: "Mayorga" },
          { id: 64, name: "Nacascolo" },
          { id: 65, name: "Curubandé" },
        ],
      },
      {
        id: 14,
        name: "Nicoya",
        districts: [
          { id: 66, name: "Nicoya" },
          { id: 67, name: "Mansión" },
          { id: 68, name: "San Antonio" },
          { id: 69, name: "Quebrada Honda" },
          { id: 70, name: "Sámara" },
        ],
      },
      {
        id: 15,
        name: "Santa Cruz",
        districts: [
          { id: 71, name: "Santa Cruz" },
          { id: 72, name: "Bolsón" },
          { id: 73, name: "Veintisiete de Abril" },
          { id: 74, name: "Tempate" },
          { id: 75, name: "Cartagena" },
        ],
      },
    ],
  },
  {
    id: 6,
    name: "Puntarenas",
    cantons: [
      {
        id: 16,
        name: "Puntarenas",
        districts: [
          { id: 76, name: "Puntarenas" },
          { id: 77, name: "Pitahaya" },
          { id: 78, name: "Chomes" },
          { id: 79, name: "Lepanto" },
          { id: 80, name: "Paquera" },
        ],
      },
      {
        id: 17,
        name: "Esparza",
        districts: [
          { id: 81, name: "Espíritu Santo" },
          { id: 82, name: "San Juan Grande" },
          { id: 83, name: "Macacona" },
          { id: 84, name: "San Rafael" },
          { id: 85, name: "San Jerónimo" },
        ],
      },
      {
        id: 18,
        name: "Buenos Aires",
        districts: [
          { id: 86, name: "Buenos Aires" },
          { id: 87, name: "Volcán" },
          { id: 88, name: "Potrero Grande" },
          { id: 89, name: "Boruca" },
          { id: 90, name: "Pilas" },
        ],
      },
    ],
  },
  {
    id: 7,
    name: "Limón",
    cantons: [
      {
        id: 19,
        name: "Limón",
        districts: [
          { id: 91, name: "Limón" },
          { id: 92, name: "Valle La Estrella" },
          { id: 93, name: "Río Blanco" },
          { id: 94, name: "Matama" },
          { id: 95, name: "Bataan" },
        ],
      },
      {
        id: 20,
        name: "Pococí",
        districts: [
          { id: 96, name: "Guápiles" },
          { id: 97, name: "Jiménez" },
          { id: 98, name: "La Rita" },
          { id: 99, name: "Río Azul" },
          { id: 100, name: "Cariari" },
        ],
      },
      {
        id: 21,
        name: "Talamanca",
        districts: [
          { id: 101, name: "Bratsi" },
          { id: 102, name: "Sixaola" },
          { id: 103, name: "Cahuita" },
          { id: 104, name: "Telire" },
          { id: 105, name: "Kekoldi" },
        ],
      },
    ],
  },
];


export default COSTA_RICA_LOCATIONS;
