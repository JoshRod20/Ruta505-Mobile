export const MUNICIPIOS_POR_DEPARTAMENTO = {
  Boaco: [
    "Boaco", "Camoapa", "San José de los Remates", "San Lorenzo",
    "Santa Lucía", "Teustepe",
  ],
  Carazo: [
    "Jinotepe", "Diriamba", "Dolores", "El Rosario", "La Conquista",
    "La Paz de Carazo", "San Marcos", "Santa Teresa",
  ],
  Chinandega: [
    "Chinandega", "Chichigalpa", "Cinco Pinos", "Corinto", "El Realejo",
    "El Viejo", "Posoltega", "Puerto Morazán", "San Francisco del Norte",
    "San Pedro del Norte", "Santo Tomás del Norte", "Somotillo", "Villanueva",
  ],
  Chontales: [
    "Juigalpa", "Acoyapa", "Comalapa", "Cuapa", "El Coral", "La Libertad",
    "San Francisco de Cuapa", "San Pedro de Lóvago", "Santo Domingo",
    "Santo Tomás", "Villa Sandino",
  ],
  "Costa Caribe Norte": [
    "Puerto Cabezas (Bilwi)", "Bonanza", "Mulukukú", "Prinzapolka",
    "Rosita", "Siuna", "Waslala", "Waspam",
  ],
  "Costa Caribe Sur": [
    "Bluefields", "Corn Island", "Desembocadura del Río Grande", "El Ayote",
    "El Rama", "El Tortuguero", "Kukra Hill", "La Cruz de Río Grande",
    "Laguna de Perlas", "Muelle de los Bueyes", "Nueva Guinea", "Paiwas",
  ],
  Estelí: [
    "Estelí", "Condega", "La Trinidad", "Pueblo Nuevo", "San Juan de Limay",
    "San Nicolás",
  ],
  Granada: ["Granada", "Diriá", "Diriomo", "Nandaime"],
  Jinotega: [
    "Jinotega", "El Cuá", "La Concordia", "San José de Bocay",
    "San Rafael del Norte", "San Sebastián de Yalí",
    "Santa María de Pantasma", "Wiwilí de Jinotega",
  ],
  León: [
    "León", "Achuapa", "El Jicaral", "El Sauce", "La Paz Centro",
    "Larreynaga (Malpaisillo)", "Nagarote", "Quezalguaque",
    "Santa Rosa del Peñón", "Telica",
  ],
  Madriz: [
    "Somoto", "Las Sabanas", "Palacagüina", "San José de Cusmapa",
    "San Juan del Río Coco", "San Lucas", "Telpaneca", "Totogalpa",
    "Yalagüina",
  ],
  Managua: [
    "Managua", "Ciudad Sandino", "El Crucero", "Mateare",
    "San Francisco Libre", "San Rafael del Sur", "Ticuantepe", "Tipitapa",
    "Villa El Carmen",
  ],
  Masaya: [
    "Masaya", "Catarina", "La Concepción", "Masatepe", "Nandasmo", "Nindirí",
    "Niquinohomo", "San Juan de Oriente", "Tisma",
  ],
  Matagalpa: [
    "Matagalpa", "Ciudad Darío", "El Tuma-La Dalia", "Esquipulas", "Matiguás",
    "Muy Muy", "Rancho Grande", "Río Blanco", "San Dionisio", "San Isidro",
    "San Ramón", "Sébaco", "Terrabona",
  ],
  "Nueva Segovia": [
    "Ocotal", "Ciudad Antigua", "Dipilto", "El Jícaro", "Jalapa",
    "Macuelizo", "Mozonte", "Murra", "Quilalí", "San Fernando",
    "Santa María", "Wiwilí de Nueva Segovia",
  ],
  "Río San Juan": [
    "San Carlos", "El Almendro", "El Castillo", "Morrito", "San Juan de Nicaragua",
    "San Miguelito",
  ],
  Rivas: [
    "Rivas", "Altagracia", "Belén", "Buenos Aires", "Cárdenas", "Moyogalpa",
    "Potosí", "San Jorge", "San Juan del Sur", "Tola",
  ],
};

export const DEPARTAMENTOS = Object.keys(MUNICIPIOS_POR_DEPARTAMENTO);

export const getMunicipios = (departamento) =>
  MUNICIPIOS_POR_DEPARTAMENTO[departamento] ?? [];