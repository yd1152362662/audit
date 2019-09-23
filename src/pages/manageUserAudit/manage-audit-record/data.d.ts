/*
 * @Author: yangdan
 * @Date: 2019-09-11 10:08:32
 * @LastEditors: yangdan
 * @LastEditTime: 2019-09-12 10:35:39
 * @Description: 添加描述
 */
export interface TableListItem {
  companyId: number;
  companyName: string;
  id: number;
  deptId: number;
  deptName?: string;
  phone?: string;
  status: number;
  statusDesc: string;
  userName: string;
  userType: number;
  userTypeDesc: string;
  realName: string;
  password: string;
  auditSate: number;
  type:1|2;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  current: number;
  size: number;
}

// 查询状态保存
export interface ArgStatus {
  current: number;
  size: number;
  companyId?: number;
  deptId?: number;
  phone?: string;
  status?: number;
  userName?: string;
  userType?: number;
}
export interface FromAddParams {
  companyIdAdd: number;
  userNameAdd: string;
  passwordAdd: string;
  phoneAdd?: string;
  deptIdAdd: number;
  statusAdd: number;
  roleSelectAdd: any;
  realNameAdd: string;
}

export interface FromEditorParams {
  companyIdEditor: number;
  userNameEditor: string;
  passwordEditor: string;
  phoneEditor?: string;
  deptIdEditor: number;
  statusEditor: number;
  roleSelectEditor: any;
  realNameEditor: string;
}


export interface userRolesParams {
  ids: any[]
}


export interface PaginationUserAuditParams {

  name: string;
  phone: string;
  idNumber: string;
  auditState: number;
  current: number;
  size: number;
  type: 1|2;
  keyWord1:string;
  keyWord2: string;
  keyWord3: string;
  keyWord4: string;

}
