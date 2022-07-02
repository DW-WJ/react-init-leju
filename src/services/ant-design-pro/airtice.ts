// import { request } from 'umi';
import { ArticleType } from '@/pages/Content/Airtice/model';
// import { request } from '@/utils/request';
import { request } from 'umi';

//定义传参数据类型
type TFindAirticeParams = {
  start: number;
  limit: number;
  params?: {
    title: string;
    author: string;
  };
};
/**
 * 查询文章列表
 * 分页查询
 * @returns
 */
export async function findAirticlList({ start, limit, params }: TFindAirticeParams): Promise<any> {
  return request(`/lejuAdmin/productArticle/findArticles/${start}/${limit}`, {
    method: 'POST',
    data: params,
  });
}
/**
 * 新增文章
 * @returns
 */
export async function addAirticlList(params: ArticleType): Promise<any> {
  return request(`/lejuAdmin/productArticle/addArticle`, {
    method: 'POST',
    data: params,
  });
}
/**
 * 更新文章
 * @returns
 */
export async function updateAirticlList(params: ArticleType): Promise<any> {
  return request(`/lejuAdmin/productArticle/updateArticle`, {
    method: 'POST',
    data: params,
  });
}
/**
 * 查询文章
 * params id
 * @returns
 */
export async function getAirticlList(id: string): Promise<any> {
  return request(`/lejuAdmin/productArticle/productArticle/${id}`, {
    method: 'GET',
  });
}
/**
 * 删除文章
 * params id
 * @returns
 */
export async function deleteAirticlList(id: string): Promise<any> {
  return request(`/lejuAdmin/productArticle/del/${id}`, {
    method: 'DELETE',
  });
}
