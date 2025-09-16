import * as WebIfc from "web-ifc"

export interface IfcTypeInfo {
  type: number
  name: string
  color: number
  category: string
}

export const IFC_TYPES: IfcTypeInfo[] = [
  // 구조 요소 (Structural Elements)
  { type: WebIfc.IFCWALL, name: "벽", color: 0xcccccc, category: "구조" },
  { type: WebIfc.IFCWALLSTANDARDCASE, name: "표준 벽", color: 0xcccccc, category: "구조" },
  { type: WebIfc.IFCSLAB, name: "슬래브", color: 0x999999, category: "구조" },
  { type: WebIfc.IFCBEAM, name: "보", color: 0x8b4513, category: "구조" },
  { type: WebIfc.IFCCOLUMN, name: "기둥", color: 0x8b4513, category: "구조" },
  { type: WebIfc.IFCROOF, name: "지붕", color: 0x8b0000, category: "구조" },
  { type: WebIfc.IFCFOOTING, name: "기초", color: 0x696969, category: "구조" },
  { type: WebIfc.IFCPILE, name: "말뚝", color: 0x696969, category: "구조" },
  { type: WebIfc.IFCRAMP, name: "경사로", color: 0xa0a0a0, category: "구조" },
  { type: WebIfc.IFCRAMPFLIGHT, name: "경사로 구간", color: 0xa0a0a0, category: "구조" },
  { type: WebIfc.IFCSTAIR, name: "계단", color: 0xa0a0a0, category: "구조" },
  { type: WebIfc.IFCSTAIRFLIGHT, name: "계단 구간", color: 0xa0a0a0, category: "구조" },
  { type: WebIfc.IFCRAILING, name: "난간", color: 0x708090, category: "구조" },

  // 건축 요소 (Architectural Elements)
  { type: WebIfc.IFCDOOR, name: "문", color: 0x8b4513, category: "건축" },
  { type: WebIfc.IFCWINDOW, name: "창문", color: 0x87ceeb, category: "건축" },
  { type: WebIfc.IFCCURTAINWALL, name: "커튼월", color: 0x87ceeb, category: "건축" },
  { type: WebIfc.IFCMEMBER, name: "부재", color: 0x8b4513, category: "건축" },
  { type: WebIfc.IFCPLATE, name: "플레이트", color: 0x708090, category: "건축" },
  { type: WebIfc.IFCCOVERING, name: "마감재", color: 0xdeb887, category: "건축" },
  { type: WebIfc.IFCCEILING, name: "천장", color: 0xf5f5dc, category: "건축" },

  // 가구 및 설비 (Furniture & Equipment)
  { type: WebIfc.IFCFURNISHINGELEMENT, name: "가구", color: 0xcd853f, category: "가구" },
  { type: WebIfc.IFCFURNITURE, name: "가구류", color: 0xcd853f, category: "가구" },
  { type: WebIfc.IFCSYSTEMFURNITUREELEMENT, name: "시스템 가구", color: 0xcd853f, category: "가구" },

  // 기계 설비 (Mechanical)
  { type: WebIfc.IFCDUCTFITTING, name: "덕트 피팅", color: 0x4169e1, category: "기계" },
  { type: WebIfc.IFCDUCTSEGMENT, name: "덕트 구간", color: 0x4169e1, category: "기계" },
  { type: WebIfc.IFCDUCTSILENCER, name: "덕트 소음기", color: 0x4169e1, category: "기계" },
  { type: WebIfc.IFCAIRTOAIRHEATRECOVERY, name: "열회수 환기장치", color: 0x4169e1, category: "기계" },
  { type: WebIfc.IFCBOILER, name: "보일러", color: 0xff4500, category: "기계" },
  { type: WebIfc.IFCCHILLER, name: "냉각기", color: 0x00bfff, category: "기계" },
  { type: WebIfc.IFCCOIL, name: "코일", color: 0x4169e1, category: "기계" },
  { type: WebIfc.IFCCOMPRESSOR, name: "압축기", color: 0x4169e1, category: "기계" },
  { type: WebIfc.IFCCONDENSER, name: "응축기", color: 0x4169e1, category: "기계" },
  { type: WebIfc.IFCCOOLEDBEAM, name: "냉각 빔", color: 0x00bfff, category: "기계" },
  { type: WebIfc.IFCCOOLINGTOWER, name: "냉각탑", color: 0x00bfff, category: "기계" },
  { type: WebIfc.IFCEVAPORATIVECOOLER, name: "증발 냉각기", color: 0x00bfff, category: "기계" },
  { type: WebIfc.IFCEVAPORATOR, name: "증발기", color: 0x00bfff, category: "기계" },
  { type: WebIfc.IFCFAN, name: "팬", color: 0x4169e1, category: "기계" },
  { type: WebIfc.IFCFILTER, name: "필터", color: 0x4169e1, category: "기계" },
  { type: WebIfc.IFCHEATEXCHANGER, name: "열교환기", color: 0xff4500, category: "기계" },
  { type: WebIfc.IFCHUMIDIFIER, name: "가습기", color: 0x4169e1, category: "기계" },
  { type: WebIfc.IFCPUMP, name: "펌프", color: 0x4169e1, category: "기계" },
  { type: WebIfc.IFCTANK, name: "탱크", color: 0x708090, category: "기계" },
  { type: WebIfc.IFCUNITARYEQUIPMENT, name: "단일 장비", color: 0x4169e1, category: "기계" },

  // 배관 설비 (Plumbing)
  { type: WebIfc.IFCPIPEFITTING, name: "배관 피팅", color: 0x32cd32, category: "배관" },
  { type: WebIfc.IFCPIPESEGMENT, name: "배관 구간", color: 0x32cd32, category: "배관" },
  { type: WebIfc.IFCVALVE, name: "밸브", color: 0x32cd32, category: "배관" },
  { type: WebIfc.IFCSANITARYTERMINAL, name: "위생기구", color: 0xffffff, category: "배관" },
  { type: WebIfc.IFCWASTETERMINAL, name: "배수 단말기", color: 0x696969, category: "배관" },

  // 전기 설비 (Electrical)
  { type: WebIfc.IFCCABLECARRIERFITTING, name: "케이블 트레이 피팅", color: 0xffd700, category: "전기" },
  { type: WebIfc.IFCCABLECARRIERSEGMENT, name: "케이블 트레이 구간", color: 0xffd700, category: "전기" },
  { type: WebIfc.IFCCABLEFITTING, name: "케이블 피팅", color: 0xffd700, category: "전기" },
  { type: WebIfc.IFCCABLESEGMENT, name: "케이블 구간", color: 0xffd700, category: "전기" },
  { type: WebIfc.IFCELECTRICAPPLIANCE, name: "전기 기기", color: 0xffd700, category: "전기" },
  { type: WebIfc.IFCELECTRICDISTRIBUTIONBOARD, name: "배전반", color: 0xffd700, category: "전기" },
  { type: WebIfc.IFCELECTRICFLOWSTORAGEDEVICE, name: "전력 저장 장치", color: 0xffd700, category: "전기" },
  { type: WebIfc.IFCELECTRICGENERATOR, name: "발전기", color: 0xffd700, category: "전기" },
  { type: WebIfc.IFCELECTRICMOTOR, name: "전동기", color: 0xffd700, category: "전기" },
  { type: WebIfc.IFCELECTRICTIMECONTROL, name: "전기 시간 제어", color: 0xffd700, category: "전기" },
  { type: WebIfc.IFCLAMP, name: "조명기구", color: 0xffff00, category: "전기" },
  { type: WebIfc.IFCLIGHTFIXTURE, name: "조명 설비", color: 0xffff00, category: "전기" },
  { type: WebIfc.IFCOUTLET, name: "콘센트", color: 0xffd700, category: "전기" },
  { type: WebIfc.IFCSWITCHINGDEVICE, name: "스위치", color: 0xffd700, category: "전기" },

  // 화재 안전 (Fire Safety)
  { type: WebIfc.IFCFIRESUPPRESSIONTERMINAL, name: "소화 단말기", color: 0xff0000, category: "화재안전" },
  { type: WebIfc.IFCALARM, name: "경보기", color: 0xff0000, category: "화재안전" },

  // 통신 (Communication)
  { type: WebIfc.IFCCOMMUNICATIONSAPPLIANCE, name: "통신 기기", color: 0x9370db, category: "통신" },
  { type: WebIfc.IFCAUDIOVISUALAPPLIANCE, name: "AV 기기", color: 0x9370db, category: "통신" },

  // 보안 (Security)
  { type: WebIfc.IFCSECURITYDEVICE, name: "보안 장치", color: 0x8b0000, category: "보안" },

  // 운송 (Transportation)
  { type: WebIfc.IFCTRANSPORTELEMENT, name: "운송 요소", color: 0x708090, category: "운송" },

  // 기타 (Others)
  { type: WebIfc.IFCBUILDINGELEMENTPROXY, name: "건축 요소 프록시", color: 0x888888, category: "기타" },
  { type: WebIfc.IFCELEMENTASSEMBLY, name: "요소 조립체", color: 0x888888, category: "기타" },
  { type: WebIfc.IFCFEATUREELEMENT, name: "특징 요소", color: 0x888888, category: "기타" },
  { type: WebIfc.IFCFEATUREELEMENTADDITION, name: "추가 특징 요소", color: 0x888888, category: "기타" },
  { type: WebIfc.IFCFEATUREELEMENTSUBTRACTION, name: "제거 특징 요소", color: 0x888888, category: "기타" },
  { type: WebIfc.IFCOPENINGELEMENT, name: "개구부 요소", color: 0x888888, category: "기타" },
  { type: WebIfc.IFCPROJECTIONELEMENT, name: "돌출 요소", color: 0x888888, category: "기타" },
  { type: WebIfc.IFCVOIDINGELEMENT, name: "공극 요소", color: 0x888888, category: "기타" },

  // 공간 (Spaces)
  { type: WebIfc.IFCSPACE, name: "공간", color: 0x87ceeb, category: "공간" },
  { type: WebIfc.IFCZONE, name: "구역", color: 0x87ceeb, category: "공간" },

  // 사이트 (Site)
  { type: WebIfc.IFCSITE, name: "사이트", color: 0x228b22, category: "사이트" },
  { type: WebIfc.IFCBUILDING, name: "건물", color: 0x8fbc8f, category: "사이트" },
  { type: WebIfc.IFCBUILDINGSTOREY, name: "층", color: 0x90ee90, category: "사이트" },
]

export const getIfcTypeInfo = (ifcType: number): IfcTypeInfo | undefined => {
  return IFC_TYPES.find((type) => type.type === ifcType)
}

export const getIfcTypesByCategory = (category: string): IfcTypeInfo[] => {
  return IFC_TYPES.filter((type) => type.category === category)
}

export const getAllIfcTypes = (): number[] => {
  return IFC_TYPES.map((type) => type.type)
}
