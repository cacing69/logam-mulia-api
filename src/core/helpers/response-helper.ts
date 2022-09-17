import { BaseResponse } from '../../utils/base-response';
import { codeMapping } from '../../utils/code-mapping';

export enum ResponseType {
  Basic = 'basic',
  Read = 'read',
  List = 'list',
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
}

export const setResponse = (type: ResponseType, data?: any, options?: any) => {
  if (type == ResponseType.Basic) {
    return baseResponse(data, options);
  }

  if (type == ResponseType.Read) {
    const message = options?.message || ResponseType.Read;
    const code = codeMapping.SUCCESS_READ;
    return baseResponse(data, { code, message });
  }

  if (type == ResponseType.List) {
    const message = options?.message || ResponseType.List;
    const code = codeMapping.SUCCESS_LIST;
    const meta = options?.meta || null;
    return baseResponse(data, { code, message, meta });
  }

  if (type == ResponseType.Create) {
    const message = options?.message || ResponseType.Create;
    const code = codeMapping.SUCCESS_CREATE;
    return baseResponse(data, { code, message });
  }

  if (type == ResponseType.Update) {
    const message = options?.message || ResponseType.Update;
    const code = codeMapping.SUCCESS_UPDATE;
    return baseResponse(data, { code, message });
  }

  if (type == ResponseType.Delete) {
    const message = options?.message || ResponseType.Delete;
    const code = codeMapping.SUCCESS_DELETE;
    return baseResponse(data, { code, message });
  }
};

export const baseResponse = (data: any, options?: any) => {
  return new BaseResponse(data, options);
};

// export const baseResponseCreate = (data: any, module?: string) => {
//   const message = `success create ${module || ''}`.trim();
//   const code = codeMapping.CREATED;
//   return baseResponse(data, { code, message });
// };

// export const baseResponseList = (data: any, options?: any) => {
//   const message = options?.message || `list data`;
//   const meta = options?.meta || null;
//   const code = codeMapping.SUCCESS_LIST;

//   return baseResponse(data, { code, message, meta });
// };

// export const baseResponseRead = (data: any, module?: string) => {
//   const message = `read ${module || ''}`.trim();
//   const code = codeMapping.SUCCESS_READ;
//   return baseResponse(data, { code, message });
// };

// export const baseResponseUpdate = (data: any, module?: string) => {
//   const message = `success update ${module || ''}`.trim();
//   const code = codeMapping.SUCCESS_UPDATE;
//   return baseResponse(data, { code, message });
// };

// export const baseResponseDelete = (data: any, module?: string) => {
//   const message = `success delete ${module || ''}`.trim();
//   const code = codeMapping.SUCCESS_DELETE;
//   return baseResponse(data, { code, message });
// };
