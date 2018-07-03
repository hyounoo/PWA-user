import i18n from '../locales/index'

export default {
  getDateOfBirth(ssn) {
    var year = ssn.substring(0, 2)
    var month = ssn.substring(2, 4)
    var day = ssn.substring(4, 6)
    // 주민번호 7째 자리가 1 이나 2인 경우에는 1900년대
    // 주민번호 7째 자리가 3 이나 4인 경우에는 2000년대
    var seventh_character = ssn.charAt(ssn.indexOf('-') == -1 ? 6 : 7)
    if (seventh_character == '1' || seventh_character == '2') {
      year = '19' + year
    } else if (seventh_character == '3' || seventh_character == '4') {
      year = '20' + year
    }
    return new Date(year, month - 1, day)
  },
  GetGender(ssn) {

    var seventh_character = ssn.charAt(ssn.indexOf('-') == -1 ? 6 : 7)
    if (
      seventh_character == '1' ||
      seventh_character == '3' ||
      seventh_character == '5' ||
      seventh_character == '7'
    ) {
      return 'CDB_GENDER_MALE'
    } else if (
      seventh_character == '2' ||
      seventh_character == '4' ||
      seventh_character == '6' ||
      seventh_character == '8'
    ) {
      return 'CDB_GENDER_FEMALE'
    }
  },
  calculateAge(dateOfBirth, startDate) {
    var diff_ms = startDate - dateOfBirth.getTime()
    var age_dt = new Date(diff_ms)
    return Math.abs(age_dt.getUTCFullYear() - 1970)
  },
  requiredRules(name) {
    return [v => !!v || name + i18n.tc('lang.validation.required')]
  },
  memberRules(family) {
    var selectedPlan = Store.state.plan.basicPlan.Plans.find(p => p.type == family.FamilyCode)

    if (selectedPlan) {
      switch (selectedPlan.type) {
        case 'FMM_EMPLOYEE':
          if (Store.state.family.members.filter(m => m != family).find(m => m.FamilyCode == selectedPlan.type))
            return [i18n.tc('lang.validation.duplicatedEmployee')]
          break
        case 'FMM_SPOUSE':
          if (Store.state.family.members.filter(m => m != family).find(m => m.FamilyCode == selectedPlan.type))
            return [i18n.tc('lang.validation.duplicatedSpouse')]
          break
        case 'FMM_PARENT':
          var parents = Store.state.family.members.filter(m => m != family).filter(m => m.FamilyCode == selectedPlan.type)

          if (parents.length > 1)
            return [i18n.tc('lang.validation.duplicatedParents')]
          break
        case 'FMM_PARENT_IN_LAW':
          var parents = Store.state.family.members.filter(m => m != family).filter(m => m.FamilyCode == selectedPlan.type)

          if (parents.length > 1)
            return [i18n.tc('lang.validation.duplicatedSpuseParents')]
          break
      }
    }

    return [v => !!v]
  },
  ssnRules(ssn) {
    var ssnString = ssn.replace("-", "");

    var duplicated = Store.state.family.members.filter(m => m.SSN.replace("-", "") == ssnString)
    if (duplicated && duplicated.length > 1) {
      return [i18n.tc('lang.validation.ssnDuplicated')];
    }


    var checkBit = new Array(2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5);
    var num7 = ssnString.charAt(6);
    var num13 = ssnString.charAt(12);
    var total = 0;
    if (ssnString.length == 13) {
      checkBit.forEach((char, i) => {
        total += ssnString.charAt(i) * checkBit[i]
      })
      // 외국인 구분 체크
      if (num7 == 0 || num7 == 9) { // 내국인 ( 1800년대 9: 남자, 0:여자)
        total = (11 - (total % 11)) % 10;
      } else if (num7 > 4) { // 외국인 ( 1900년대 5:남자 6:여자  2000년대 7:남자, 8:여자)
        total = (13 - (total % 11)) % 10;
      } else { // 내국인 ( 1900년대 1:남자 2:여자  2000년대 3:남자, 4:여자)
        total = (11 - (total % 11)) % 10;
      }

      if (total != num13) {
        return [i18n.tc('lang.validation.ssnInvalid')];
      }
    } else if (ssnString.length > 0) {
      return [i18n.tc('lang.validation.ssnInvalid')];
    } else {
      return [v => !!v || i18n.tc('lang.member.ssn') + i18n.tc('lang.validation.required')]
    }
  }
}
