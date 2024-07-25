import instance from "@/configs/axios";
import { BackwardFilled } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button,  Form,  FormProps, Input, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Link, useParams } from "react-router-dom";


type FieldType ={
    name?: string;
    price?: number;
    description?:string;
};

const ProductEditPage = ()=>{
    const {id} = useParams();
    console.log(id);
    const [messageApi, contextHolder ] = message.useMessage();
    const queryClient = useQueryClient();

    const {data,isLoading, isError,error} = useQuery({
        queryKey:['product',id],
        queryFn: async ()=>{
            try {
                return await instance.get(`products/${id}`);
            } catch (error) {
                throw new Error(`Lay that bai`);                
            }
        },
    });
    const {mutate,isPending } = useMutation({
        mutationFn: async (product: FieldType)=>{
            try {
                return await instance.put(`/products/${id}`, product);
            } catch (error) {
                throw new Error(`Cap nhat that bai`);
            }
        },
        onSuccess: ()=>{

            messageApi.open({
                type :"success",
                content: " Cap nhat san pham thanh cong",
            });
            // Cap nhat 2
            queryClient.invalidateQueries({
                queryKey:['product'],
            });
        },
        onError: (error)=>{
            messageApi.open({
                type: "error",
                content: error.message,
            });
        }
    });
    
const onFinish: FormProps<FieldType>['onFinish'] = (values) => {

    mutate(values);
  };

  if(isLoading) return <div>Loading....</div>
  if(isError) return <div>{error.message}</div>

  console.log(data?.data);
  
    return(
        <div>
              {contextHolder}
        <div className="flex items-center justify-between mb-5">
            <h1 className="text-2xl font-semibold">Cap nhat: {data?.data?.name}</h1>
            <Button type="primary">
                <Link to={`/admin/products`}>
                {/* Back quay lại trang  */}
                <BackwardFilled/> Quay lai
                </Link>
            </Button>
        </div>
        <div className="max-w-4xl mx-auto">
            <Form
               
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ ...data?.data}}
                onFinish={onFinish}
                // onFinishFailed={onFinishFailed}
                // autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="Ten san pham"
                    name="name"
                    rules={[{ required: true, message: 'Ten san pham phai co!' }]}
                    >
                    <Input disabled={isPending} />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Gia san pham"
                    name="price"
                    rules={[{ required: true, message: 'Gia san pham phai co!' }]}
                    >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Mo ta san pham"
                    name="description"
                    >
                    <TextArea rows={4} />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    </div>
    );

};
export default ProductEditPage;