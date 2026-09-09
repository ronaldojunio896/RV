export interface AlvoImportacao {
  nome: string;
  cpf: string;
  nascimento: string;
  mae?: string;
  renda?: string;
  profissao?: string;
  telefones?: string;
  endereco: string;
  cep: string;
  situacao?: string;
}

export const RAW_ALVOS: AlvoImportacao[] = [
  { nome: "JOAO LOURENCO DE ALMEIDA", cpf: "50100572634", nascimento: "10/08/1950", mae: "LUZIA ANDRE DE ALMEIDA", renda: "R$ 5.900,00", profissao: "ADMINISTRADOR DE PEQUENA E MÉDIA EMPRESA", telefones: "(31) 3493-2795 | (31) 3488-9025", endereco: "Rua Mae d Agua, 129, Belo Horizonte - MG", cep: "31980-410" },
  { nome: "VANILDA PEREIRA DE JESUS", cpf: "35535652687", nascimento: "31/10/1958", mae: "ONDINA ROSA PEREIRA", renda: "R$ 13.450,00", profissao: "ADMINISTRADOR DE PEQUENA E MÉDIA EMPRESA", telefones: "(31) 3493-6686 | (31) 3623-1034", endereco: "Rua Mae d Agua, 203, Belo Horizonte - MG", cep: "31980-410" },
  { nome: "FRANCISCO ASSIS DE PAULO", cpf: "26427885634", nascimento: "31/12/1956", mae: "", renda: "R$ 1.350,00", profissao: "", telefones: "", endereco: "Rua Mae d Agua, 106, Belo Horizonte - MG", cep: "31980-410" },
  { nome: "MARCIA APARECIDA FERREIRA", cpf: "19529832826", nascimento: "05/10/1957", mae: "ENEDINA EGIDEA FERREIRA", renda: "R$ 1.150,00", profissao: "", telefones: "(31) 3493-6726 | (31) 99789-1395", endereco: "Rua Mae d Agua, 322, Belo Horizonte - MG", cep: "31980-410" },
  { nome: "CARLOS ALBERTO DOS REIS", cpf: "37171585620", nascimento: "14/06/1960", mae: "LEIVA DA ASSUNCAO DOS REIS", renda: "R$ 1.250,00", profissao: "", telefones: "(31) 3493-9629 | (31) 99215-4263", endereco: "Rua Mae d Agua, 117, Belo Horizonte - MG", cep: "31980-410" },
  { nome: "ANTONIO RICARDO PINHEIRO DOS SANTOS", cpf: "46680667615", nascimento: "28/06/1963", mae: "IZALTINA PINHEIRO DOS SANTOS", renda: "R$ 1.650,00", profissao: "", telefones: "(31) 3493-9621 | (31) 99211-8571", endereco: "Rua Mae d Agua, 55, Belo Horizonte - MG", cep: "31980-410" },
  { nome: "CONCEICAO LIBERALDA FERREIRA", cpf: "85915440649", nascimento: "22/12/1928", mae: "ALTINA JESUS DE FREITAS", renda: "R$ 1.300,00", profissao: "", telefones: "(31) 3493-9702", endereco: "Rua Mae d Agua, 117, Belo Horizonte - MG", cep: "31980-410", situacao: "FALECIDO" },
  { nome: "TELMA SUELI PENA SILVA SANTANA", cpf: "00826832717", nascimento: "16/03/1971", mae: "MARIA DAS G P DA SILVA", renda: "R$ 3.650,00", profissao: "", telefones: "(31) 3447-7218 | (31) 3053-8630", endereco: "Rua Mae d Agua, 156, Belo Horizonte - MG", cep: "31980-410" },
  { nome: "GERALDO DE ASSIS DA SILVA", cpf: "61343641691", nascimento: "29/09/1963", mae: "ALBINA APARECIDA GOMES", renda: "R$ 1.150,00", profissao: "", telefones: "", endereco: "Rua Mae d Agua, 15, Belo Horizonte - MG", cep: "31980-410" },
  { nome: "GERALDO MAGELA DOS SANTOS", cpf: "04547713634", nascimento: "14/07/1941", mae: "JOAQUINA BATISTA DE SA", renda: "R$ 6.200,00", profissao: "ADMINISTRADOR DE PEQUENA E MÉDIA EMPRESA", telefones: "(31) 3493-2623", endereco: "Rua Mae d Agua, 15, Belo Horizonte - MG", cep: "31980-410" },
  { nome: "GERALDO SERGIO GONCALVES SILVA", cpf: "13349527876", nascimento: "16/08/1971", mae: "ADELIA GONCALVES SILVA", renda: "R$ 1.450,00", profissao: "ZELADOR DE EDIFÍCIO", telefones: "(31) 3493-6740 | (31) 99695-0334", endereco: "Rua Mae d Agua, 79, Belo Horizonte - MG", cep: "31980-410" },
  { nome: "PAULO CESAR VIEIRA", cpf: "62457861691", nascimento: "02/05/1961", mae: "IRACI DA SILVA VIEIRA", renda: "R$ 1.550,00", profissao: "", telefones: "(31) 3493-4965", endereco: "Rua Mae d Agua, 128, Belo Horizonte - MG", cep: "31980-410", situacao: "FALECIDO" },
  { nome: "ANTONIO DO CARMO NERI PINTO", cpf: "08383367600", nascimento: "15/07/1949", mae: "RITA ANGELICA DA COSTA", renda: "R$ 1.550,00", profissao: "", telefones: "(31) 99152-3433 | (31) 99813-2432", endereco: "Rua Mae d Agua, 190, Belo Horizonte - MG", cep: "31980-410" },
  { nome: "ROSIMEIRE ROCHA CRUZ VIANA", cpf: "04786978647", nascimento: "25/06/1980", mae: "MARIA JOSE DA CRUZ", renda: "R$ 1.250,00", profissao: "ATENDENTE DE CONSULTÓRIO VETERINÁRIO", telefones: "(31) 3445-0484 | (31) 98722-9544", endereco: "Rua Mae d Agua, 100, Belo Horizonte - MG", cep: "31980-410" },
  { nome: "TATIANE FERNANDA DE PAIVA LOPES", cpf: "03937226605", nascimento: "03/03/1979", mae: "IOLANDA DE PAIVA", renda: "R$ 1.250,00", profissao: "", telefones: "(31) 3493-3193 | (31) 99826-5885", endereco: "Rua Mae d Agua, 152, Belo Horizonte - MG", cep: "31980-410" },
  { nome: "ALEX DE OLIVEIRA", cpf: "07481240639", nascimento: "04/07/1979", mae: "JUDITE ALVES", renda: "R$ 1.200,00", profissao: "", telefones: "(31) 98916-5473", endereco: "Rua Mae d Agua, 16, Belo Horizonte - MG", cep: "31980-410" },
  { nome: "MARIA LUCIA DE OLIVEIRA", cpf: "08267301674", nascimento: "06/12/1955", mae: "MARIA GONCALVES FRANCO", renda: "R$ 1.350,00", profissao: "", telefones: "(31) 3493-1242 | (31) 98515-6915", endereco: "Rua Mae d Agua, 197, Belo Horizonte - MG", cep: "31980-410" },
  { nome: "MARIA APARECIDA LIMA", cpf: "02661807608", nascimento: "14/02/1963", mae: "", renda: "R$ 3.400,00", profissao: "ADMINISTRADOR DE PEQUENA E MÉDIA EMPRESA", telefones: "", endereco: "Rua Mae d Agua, 197, Belo Horizonte - MG", cep: "31980-410", situacao: "FALECIDO" },
  { nome: "ROSIANE FERREIRA DOS SANTOS", cpf: "08279285644", nascimento: "07/02/1983", mae: "ANDRELISA VALETINA FERREIRA", renda: "R$ 1.300,00", profissao: "", telefones: "(31) 3785-5456 | (31) 99637-7227", endereco: "Rua Mae d Agua, 88, Belo Horizonte - MG", cep: "31980-410" },
  { nome: "MARGARIDA SOARES", cpf: "07395223616", nascimento: "07/06/1935", mae: "MARIA VIANA", renda: "R$ 1.350,00", profissao: "", telefones: "(92) 3885-1417", endereco: "Rua Mae d Agua, 15, Belo Horizonte - MG", cep: "31980-410" },
  { nome: "FLAVIA CRISTINA DE ALMEIDA", cpf: "05955715657", nascimento: "08/12/1982", mae: "MARIA LUCIA DE ALMEIDA", renda: "R$ 4.350,00", profissao: "ADVOGADO GENERALISTA", telefones: "(31) 3493-1214 | (31) 98766-8287", endereco: "Rua Mae d Agua, 129, Belo Horizonte - MG", cep: "31980-410" },
  { nome: "RENATA CRISTINA DE PAULO", cpf: "05136437618", nascimento: "01/04/1982", mae: "MARTA REGINA DE PAULO", renda: "R$ 2.800,00", profissao: "AUXILIAR ADMINISTRATIVO", telefones: "(31) 3493-3580 | (31) 97584-9999", endereco: "Rua Mae d Agua, 106, Belo Horizonte - MG", cep: "31980-410" },
  { nome: "IRACEMA DA LUZ GARCIA", cpf: "81211520625", nascimento: "26/02/1942", mae: "", renda: "R$ 6.050,00", profissao: "ADMINISTRADOR DE PEQUENA E MÉDIA EMPRESA", telefones: "", endereco: "Rua Mae d Agua, 105, Belo Horizonte - MG", cep: "31980-410" },
  { nome: "DARIUSON DIAS NUNES", cpf: "01170161600", nascimento: "16/12/1975", mae: "ZILVA ROSA NUNES", renda: "R$ 1.150,00", profissao: "", telefones: "(31) 3433-6796 | (31) 99372-3508", endereco: "Rua Mae d Agua, 75, Belo Horizonte - MG", cep: "31980-410" },
  { nome: "FATIMA AMARAL DE OLIVEIRA", cpf: "07218432638", nascimento: "15/06/1935", mae: "JOANA GALVAO LOPES", renda: "R$ 1.350,00", profissao: "", telefones: "(31) 99840-7509", endereco: "Rua Mae d Agua, 42, Belo Horizonte - MG", cep: "31980-410" }
];