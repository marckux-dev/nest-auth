// src/seed/data/sample-products.ts (Spanish - Spain)
import { CreateProductDto } from 'src/product/dto/create-product.dto';

export const sampleProducts: CreateProductDto[] = [
  // antisepticoS
  {
    name: 'Clorhexidina Gluconato 0.5% Solución',
    short_name: 'Clorhexidina 0.5%',
    category: 'antiseptico',
    active_principle: 'Clorhexidina Gluconato',
  },
  {
    name: 'Povidona Yodada 10% Solución',
    short_name: 'Povidona Yodada 10%',
    category: 'antiseptico',
    active_principle: 'Povidona Yodada',
    synonyms: 'Betadine',
  },
  {
    name: 'Toallitas de Alcohol Isopropílico 70%',
    short_name: 'Toallitas Alcohol 70%',
    category: 'antiseptico',
    active_principle: 'Alcohol Isopropílico',
  },
  {
    name: 'Agua Oxigenada 3% Solución',
    short_name: 'Agua Oxigenada 3%',
    category: 'antiseptico',
    active_principle: 'Peróxido de Hidrógeno',
  },
  {
    name: 'Gasas Estériles 10x10 cm',
    short_name: 'Gasas 10x10',
    category: 'curas',
    synonyms: 'Compresas',
  },
  {
    name: 'Suero Fisiológico 0.9% Irrigación (500ml)',
    short_name: 'Suero Irrigación 500ml',
    category: 'curas',
    active_principle: 'Cloruro de Sodio',
    synonyms: 'Salino',
  },
  {
    name: 'Guantes Estériles (Talla 7.5)',
    short_name: 'Guantes 7.5',
    category: 'epi',
    synonyms: 'Guantes Quirúrgicos',
  },
  {
    name: 'Apósito Abdominal Estéril 20x25 cm',
    short_name: 'Apósito Abdominal 20x25',
    category: 'curas',
    synonyms: 'Compresas',
  },
  {
    name: 'Paño Quirúrgico Estéril',
    short_name: 'Paño Quirúrgico',
    category: 'curas',
  },

  // EQUIPO DE PROTECCIÓN PERSONAL (EPP)
  {
    name: 'Mascarilla FFP2/N95',
    short_name: 'Mascarilla FFP2',
    category: 'epi',
    synonyms: 'Respirador N95',
  },
  {
    name: 'Pantalla Facial',
    short_name: 'Pantalla Facial',
    category: 'epi',
    synonyms: 'Visor',
  },
  {
    name: 'Batas Desechables (Talla L)',
    short_name: 'Bata L',
    category: 'epi',
  },
  {
    name: 'Guantes de Nitrilo (Talla M)',
    short_name: 'Guantes M',
    category: 'epi',
  },
  // MEDICAMENTOS CARDIOVASCULARES
  {
    name: 'Adrenalina 1mg/10ml (1:10.000) Jeringa Precargada',
    short_name: 'Adrenalina 1:10.000',
    category: 'medicamentos',
    active_principle: 'adrenalina',
    synonyms: 'epinefrina',
  },
  {
    name: 'Amiodarona 150mg/3ml Vial',
    short_name: 'Amiodarona 150mg',
    category: 'medicamentos',
    active_principle: 'Amiodarona',
    synonyms: 'Trangorex',
  },
  {
    name: 'Atropina 1mg/10ml Jeringa Precargada',
    short_name: 'Atropina 1mg',
    category: 'medicamentos',
    active_principle: 'Atropina',
    synonyms: 'Sulfato',
  },
  {
    name: 'Lidocaína 2% (100mg/5ml) Jeringa Precargada',
    short_name: 'Lidocaína 2%',
    category: 'medicamentos',
    active_principle: 'Lidocaína',
    synonyms: 'Xilonibsa',
  },
  {
    name: 'Noradrenalina 4mg/4ml Vial',
    short_name: 'Noradrenalina 4mg',
    category: 'medicamentos',
    active_principle: 'Norepinefrina',
  },
  {
    name: 'Nitroglicerina 0.4mg Spray Sublingual',
    short_name: 'Nitroglicerina Spray',
    category: 'medicamentos',
    active_principle: 'Nitroglicerina',
    synonyms: 'Cafinitrina, Vernies',
  },
  {
    name: 'Ácido Acetilsalicílico 300mg Comprimidos Masticables',
    short_name: 'AAS 300mg',
    category: 'medicamentos',
    active_principle: 'Ácido Acetilsalicílico',
    synonyms: 'Aspirina, Adiro',
  },

  // MEDICAMENTOS RESPIRATORIOS
  {
    name: 'Salbutamol 2.5mg/2.5ml Solución para Nebulizador',
    short_name: 'Salbutamol 2.5mg',
    category: 'medicamentos',
    active_principle: 'Salbutamol Sulfato',
    synonyms: 'Ventolin',
  },
  {
    name: 'Bromuro de Ipratropio 0.5mg/2ml Solución para Nebulizador',
    short_name: 'Ipratropio 0.5mg',
    category: 'medicamentos',
    active_principle: 'Bromuro de Ipratropio',
    synonyms: 'Atrovent',
  },
  {
    name: 'Metilprednisolona 125mg/2ml Vial',
    short_name: 'Metilprednisolona 125mg',
    category: 'medicamentos',
    active_principle: 'Metilprednisolona',
    synonyms: 'Solu-Moderin',
  },
  {
    name: 'Sulfato de Magnesio 1.5g/10ml Vial',
    short_name: 'Sulfato de Magnesio 1.5g',
    category: 'medicamentos',
    active_principle: 'Sulfato de Magnesio',
    synonyms: 'Sulmetin',
  },

  // ANALGÉSICOS Y SEDANTES
  {
    name: 'Morfina 10mg/1ml Vial',
    short_name: 'Morfina 10mg',
    category: 'medicamentos',
    active_principle: 'Morfina Clorhidrato',
    synonyms: 'cloruro mórfico',
  },
  {
    name: 'Fentanilo 150mcg/3ml Vial',
    short_name: 'Fentanilo 150mcg',
    category: 'medicamentos',
    active_principle: 'Fentanilo Citrato',
    synonyms: 'Fentanest',
  },
  {
    name: 'Ketorolaco 30mg/1ml Vial',
    short_name: 'Ketorolaco 30mg',
    category: 'medicamentos',
    active_principle: 'Ketorolaco Trometamol',
    synonyms: 'Toradol Deoal',
  },
  {
    name: 'Midazolam 15mg/3ml Vial',
    short_name: 'Midazolam 15mg',
    category: 'medicamentos',
    active_principle: 'Midazolam',
    synonyms: 'Dormicum',
  },
  {
    name: 'Propofol 1% (200mg/20ml) Vial',
    short_name: 'Propofol 200mg',
    category: 'Sedantes',
    active_principle: 'Propofol',
    synonyms: 'Diprivan, Recofol',
  },
  {
    name: 'Ketamina 500mg/10ml Vial',
    short_name: 'Ketamina 500mg',
    category: 'medicacion',
    active_principle: 'Ketamina Clorhidrato',
    synonyms: 'Ketolar',
  },

  // OTROS MEDICAMENTOS DE EMERGENCIA
  {
    name: 'Glucosa 50% (10g/20ml) Vial',
    short_name: 'Glucosa 50%',
    category: 'medicacion',
    active_principle: 'Glucosa',
    synonyms: 'Glucosmon',
  },
  {
    name: 'Naloxona 0.4mg/1ml Jeringa Precargada',
    short_name: 'Naloxona 0.4mg',
    category: 'medicacion',
    active_principle: 'Naloxona Clorhidrato',
    synonyms: 'Naloxona',
  },
  {
    name: 'Ondansetrón 4mg/2ml Vial',
    short_name: 'Ondansetrón 4mg',
    category: 'medicacion',
    active_principle: 'Ondansetrón',
    synonyms: 'Zofran',
  },
];
