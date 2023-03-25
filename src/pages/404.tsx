import type { NextPage } from "next";

const NotFound: NextPage = () => {
  return (
    <div className="flex flex-col items-center pt-16">
      <p className="font-medium">This page does not exist</p>
    </div>
  );
};

export default NotFound;
