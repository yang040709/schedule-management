import { nanoid } from 'nanoid'
export const getTemplateId = () => {
  return `yang_template_${nanoid()}`
}

export const getId = () => {
  return `yang_id_${nanoid()}`
}
