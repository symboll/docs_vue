export default {
  policeStationList: [],
  policeList: [],
  useDirectionList: [],
  visitFrequencyList: [],
  zoneList: [],
  organTypeList: [],
  personTypeList:[],
  personLevelList:[],
  typeList: [],
  infoSourceList: [],
  statusList: [
    {
      id: 1,
      label: "报备审核",
      reportFlag: false,
      status: 'init'
    },
    {
      id: 2,
      label: "报备审核退回",
      reportFlag: false,
      status: 'fail'
    },
    {
      id: 3,
      label: "报备审核通过",
      reportFlag: false,
      status: 'finish'
    },
    {
      id: 4,
      label: "撤销报备审核",
      reportFlag: true,
      status: 'init'
    },
    {
      id: 5,
      label: "撤销报备审核退回",
      reportFlag: true,
      status: 'fail'
    },
    {
      id: 6,
      label: "撤销报备审核通过",
      reportFlag: true,
      status: 'finish'
    }
  ],
  infoSubmitstatusList: [
    {
      id: 1,
      label: "待审核",
      status: 'init'
    },
    {
      id: 2,
      label: "已审核",
      status: 'finish'
    },
    {
      id: 3,
      label: "已退回",
      status: 'fail'
    },
    
  ],

  positionStatusList: [
    {
      id: 1,
      label: "审核中",
      status: 'init'
    },
    {
      id: 2,
      label: "拒绝",
      status: 'fail'
    },
    {
      id: 3,
      label: "完成",
      status: 'finish'
    },
  ],

  evaluationList:[],
  tEvaluationList: []
}