import { z } from "zod";

export const productSchema = z.object({
    title: z.string().min(1, "제목을 입력해주세요.").max(50, "제목은 50자를 초과할 수 없습니다.").min(4, "제목은 4자 이상이어야 합니다."),
    price: z.coerce.number().min(0, "가격은 0원 이상이어야 합니다.").max(100000000, "가격은 1억원을 초과할 수 없습니다."),
    description: z.string().min(1, "설명을 입력해주세요.").max(1000, "설명은 1000자를 초과할 수 없습니다.").min(10, "설명은 10자 이상이어야 합니다."),
    photo: z.union([
        z.instanceof(File, { message: "이미지를 선택해주세요." })
            .refine((file) => file.size <= 2 * 1024 * 1024, "이미지 크기는 2MB를 초과할 수 없습니다.")
            .refine((file) => file.type.startsWith("image/"), "이미지 파일만 업로드 가능합니다."),
        z.string().min(1, "이미지 URL이 필요합니다.")
    ])
});

export type ProductType = z.infer<typeof productSchema>; 