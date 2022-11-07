import { useRouter } from "next/router";
import React, { useEffect } from "react";

function useOnRouteChnage(
  handler: ((...args: any) => void) | ((...args: any) => any)
) {
  const router = useRouter();

  useEffect(() => handler, [router.asPath]);
}

export default useOnRouteChnage;
