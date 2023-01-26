import Link from "next/link";

export default function FormLink(props) {
  return (
    <Link href={props.href} shallow>
      <a
        className={`${props.className} transition text-sm text-auth-link hover:text-auth-link-hover ml-1`}
        // target="_blank"
      >
        {props.children}
      </a>
    </Link>
  );
}
