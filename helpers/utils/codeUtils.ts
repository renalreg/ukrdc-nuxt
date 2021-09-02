export function formatGender(genderCode: number | string): string {
  // https://datadictionary.nhs.uk/attributes/person_gender_code.html
  if (genderCode === 1 || genderCode === '1') {
    return 'Male'
  } else if (genderCode === 2 || genderCode === '2') {
    return 'Female'
  } else if (genderCode === 9 || genderCode === '9') {
    return 'Not Specified'
  } else {
    return 'Not Known'
  }
}
