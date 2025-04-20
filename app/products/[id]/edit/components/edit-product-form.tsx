"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { getUploadUrl, updateProduct } from "../action";
import { productSchema, ProductType } from "@/app/(tabs)/home/add/zodSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

interface EditProductFormProps {
  id: string;
  initialData: {
    title: string;
    price: number;
    description: string;
    photo: string | null;
  };
}

export default function EditProductForm({
  id,
  initialData,
}: EditProductFormProps) {
  const router = useRouter();
  const [preview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductType>({
    resolver: zodResolver(productSchema),
  });

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("이미지 크기는 2MB를 초과할 수 없습니다.");
      event.target.value = "";
      return;
    }
    setPreview(URL.createObjectURL(file));
    const { success, result } = await getUploadUrl();
    if (!success) {
      alert("이미지 업로드에 실패했습니다.");
      return;
    }
    setFile(file);
    const { id, uploadURL } = result;
    setUploadUrl(uploadURL);
    setValue(
      "photo",
      `${process.env.NEXT_PUBLIC_CLOUDFLARE_DELIVERY_URL}/${id}`
    );
  };

  const onSubmit = handleSubmit(async (data: ProductType) => {
    console.log("수정된 제품 정보:", {
      title: data.title,
      price: data.price,
      description: data.description,
      photo: data.photo,
    });

    try {
      setIsLoading(true);
      let photoUrl = data.photo;

      // 새 이미지가 선택된 경우에만 Cloudflare 업로드 진행
      if (file) {
        const cloudflareForm = new FormData();
        cloudflareForm.append("file", file);
        const response = await fetch(uploadUrl, {
          method: "post",
          body: cloudflareForm,
        });
        if (response.status !== 200) {
          throw new Error("이미지 업로드에 실패했습니다.");
        }
        const { result } = await response.json();
        if (!result || !result.variants || !result.variants[0]) {
          throw new Error("이미지 업로드 응답이 올바르지 않습니다.");
        }
        photoUrl = `${process.env.NEXT_PUBLIC_CLOUDFLARE_DELIVERY_URL}/${result.id}`;
      }

      const formData = new FormData();
      formData.append("photo", photoUrl);
      formData.append("title", data.title);
      formData.append("price", data.price.toString());
      formData.append("description", data.description);

      console.log("서버로 전송할 데이터:", {
        photo: photoUrl,
        title: data.title,
        price: data.price,
        description: data.description,
      });

      const result = await updateProduct(id, formData);
      if (result.success) {
        router.push(`/products/${id}`);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert(
        error instanceof Error
          ? error.message
          : "제품 수정 중 오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  });

  useEffect(() => {
    // 초기 데이터 설정
    setValue("title", initialData.title);
    setValue("price", initialData.price);
    setValue("description", initialData.description);
    setValue("photo", initialData.photo || "");

    // 기존 이미지를 설정
    if (initialData.photo) {
      console.log("Setting preview image:", initialData.photo);
      setPreview(`${initialData.photo}/public`);
    }
  }, [initialData, setValue]);

  return (
    <div>
      <form onSubmit={onSubmit} className="p-5 flex flex-col gap-5">
        <label
          htmlFor="photo"
          className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer"
          style={{
            backgroundImage: preview ? `url(${preview})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neutral-300"></div>
            </div>
          ) : preview ? (
            <div
              onClick={(e) => {
                e.preventDefault();
                setPreview("");
                setFile(null);
                setValue("photo", "");
              }}
              className="w-full h-full bg-black/50 text-white flex items-center justify-center"
            >
              <XMarkIcon className="w-10" />
            </div>
          ) : (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neutral-400/75 text-sm">
                사진을 추가해주세요.
              </div>
            </>
          )}
        </label>
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          className="hidden"
        />
        <Input
          required
          placeholder="제목"
          type="text"
          {...register("title")}
          errors={errors?.title?.message ? [errors.title.message] : undefined}
        />
        <Input
          type="number"
          required
          placeholder="가격"
          {...register("price")}
          errors={errors?.price?.message ? [errors.price.message] : undefined}
        />
        <Input
          type="text"
          required
          placeholder="자세한 설명"
          {...register("description")}
          errors={
            errors?.description?.message
              ? [errors.description.message]
              : undefined
          }
        />
        <Button title="수정 완료" />
      </form>
    </div>
  );
}
