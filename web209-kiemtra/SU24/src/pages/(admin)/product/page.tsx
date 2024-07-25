import { IProduct } from "@/common/product";
import instance from "@/configs/axios";
import { PlusCircleFilled } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, message, Popconfirm, Skeleton, Space, Table } from "antd";
import { Link } from "react-router-dom";

const ProductPage = ()=>{
    const [ messageApi, contextHolder]= message.useMessage();
    const queryClient = useQueryClient();
    const {data, isLoading, isError,error} = useQuery ({
        queryKey: ['products'],
        queryFn: async ()=>{
            try {
                return await instance.get(`/products`);
            } catch (error) {
                throw new Error (" Call Api that bai")
            }
        }
    });

    const {mutate} = useMutation({
        mutationFn: async (id: number)=>{
            try {
                return await instance.delete(`/products/${id}`);
            } catch (error) {
                throw new Error ("Xoa that bai");
            }
        },
        onSuccess: ()=>{
            messageApi.open({
                type: "success",
                content: " San pham da duoc xoa ",
            })
            queryClient.invalidateQueries({
                queryKey:["products"],
            });
        },
        onError:(error)=>{
            messageApi.open({
                type: "success",
                content: error.message,
            })
        },
    });

    const dataSource  =data?.data.map((product: IProduct)=>({
        key: product.id,
        ...product,
    }));

    const columns =[
        {
            key: "name",
            title:"Ten san pham",
            dataIndex:"name",
        },
        {
            key: "price",
            title:"Gia san pham",
            dataIndex:"price",
        },
        {
            id: "actions",
            title : "Hanh dong",
            render: (_: any, product: IProduct) => {
                return (
                    <Space>
                        <Popconfirm
                            title="Xóa sản phẩm"
                            description="Bạn có muốn xóa sản phẩm này không?"
                            onConfirm={() => mutate(product.id!)}
                            // onCancel={cancel}
                            okText="Có"
                            cancelText="Không"
                        >
                            <Button danger>Xóa</Button>
                        </Popconfirm>
                        <Link to={`/admin/products/${product.id}/edit`}>
                            <Button>Cập nhật</Button>
                        </Link>
                    </Space>
                );
            },
        }
    ]

    if(isLoading) return <div>Loading...</div>
    if (isError) return <div>{error.message}</div>

    return(
    <div>
        {contextHolder}
        <div className="flex items-center justify-between mb-5">
            <h1 className="text-2xl font-semibold">Quan ly san pham</h1>
            <Button type="primary">
                <Link to={`/admin/products/add`}>
                    <PlusCircleFilled/> Them san pham
                </Link>
            </Button>
        </div>
        <Skeleton loading={isLoading} active>
                <Table dataSource={dataSource} columns ={columns} />
            </Skeleton>
    </div>
    );
};

export default ProductPage;