import { Wrapper } from "@/components/wrapper";
import { PropsWithChildren } from "react";

export default function OldLayout({ children }: PropsWithChildren) {
  return <Wrapper>{children}</Wrapper>;
}
