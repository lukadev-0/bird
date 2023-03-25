import type { NextPage } from "next";
import Head from "next/head";

const About: NextPage = () => {
  return (
    <>
      <Head>
        <title>About - Bird</title>
        <meta name="description" content="Totally not a Twitter clone" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="mt-16 text-lg font-medium">About</h1>
      <p>
        This is <i>totally not</i> an{" "}
        <a
          href="https://github.com/lukadev-0/bird"
          className="font-medium underline decoration-primary-500"
        >
          open source
        </a>{" "}
        Twitter clone made by{" "}
        <a
          href="https://github.com/lukadev-0"
          className="font-medium underline decoration-primary-500"
        >
          LukaDev
        </a>{" "}
        using the{" "}
        <a
          href="https://create.t3.gg/"
          className="font-medium underline decoration-primary-500"
        >
          T3 stack
        </a>{" "}
        deployed on{" "}
        <a
          href="https://vercel.com/"
          className="font-medium underline decoration-primary-500"
        >
          Vercel
        </a>
        .
      </p>
    </>
  );
};

export default About;
