const chars=[
{required:true,type:"ORGANOLEPTICA",name:"Color",criterion:"CUALITATIVO",spec:"Característico",unit:"N.A.",method:"OVOPE-CA-I-024",expected:"Característico"},
{required:true,type:"ORGANOLEPTICA",name:"Olor",criterion:"CUALITATIVO",spec:"Característico",unit:"N.A.",method:"OVOPE-CA-I-024",expected:"Característico"},
{required:true,type:"FISICOQUIMICA",name:"Sólidos totales",criterion:"RANGO",spec:"11.00 – 12.00",unit:"%",method:"OVOPE-CA-I-001",min:11,max:12},
{required:false,type:"FISICOQUIMICA",name:"°Brix",criterion:"RANGO",spec:"14.00 – 15.00",unit:"N.A.",method:"OVOPE-CA-I-001",min:14,max:15},
{required:true,type:"FISICOQUIMICA",name:"pH",criterion:"RANGO",spec:"8.50 – 9.50",unit:"N.A.",method:"OVOPE-CA-I-004",min:8.5,max:9.5},
{required:true,type:"MICROBIOLOGICA",name:"Numeración de aerobios mesófilos viables",criterion:"MAXIMO",spec:"≤ 10,000",unit:"UFC / g",method:"OVOPE-CA-I-011",max:10000},
{required:true,type:"MICROBIOLOGICA",name:"Numeración de coliformes totales",criterion:"MAXIMO",spec:"≤ 10",unit:"UFC / g",method:"OVOPE-CA-I-014",max:10},
{required:true,type:"MICROBIOLOGICA",name:"Salmonella sp.",criterion:"AUSENCIA",spec:"Ausencia",unit:"/ 25 g",method:"OVOPE-CA-I-017",expected:"Ausencia"}];
const lots=[
{id:"C39487D2",date:"22/09/2026",done:0,state:"PENDIENTE",result:"—"},
{id:"C39487D3",date:"22/09/2026",done:4,state:"EVALUACIÓN PARCIAL",result:"—"},
{id:"C39487D4",date:"21/09/2026",done:8,state:"COMPLETA - ABIERTA",result:"PRELIMINAR"},
{id:"C39487D5",date:"20/09/2026",done:8,state:"CERRADA",result:"CONFORME"}];
