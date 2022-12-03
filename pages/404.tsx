import Image from "next/image";

import fourOhfour from "../public/404.png";

export default function Custom404() {
  return (
    <div style={{ height: 600, position: "relative" }}>
      <Image
        // loader={myLoader}
        src={fourOhfour}
        alt="404 illustration"
        layout="fill"
        objectFit="contain"
        quality={100}
      />
    </div>
  );
}
