import { Outlet } from "react-router-dom";
import Container from "../ui/Container";
import PageHeader from "../ui/PageHeader";

/**
 * Standard page scaffold: width container + optional page header + content
 * outlet. Composes the ui primitives; owns no styling of its own.
 */
export default function PageContainer({ eyebrow, title, description, actions, children }) {
  return (
    <Container className="py-8">
      {(title || actions || eyebrow) && (
        <PageHeader eyebrow={eyebrow} title={title} description={description} actions={actions} />
      )}
      <div className={title ? "mt-8" : ""}>{children ?? <Outlet />}</div>
    </Container>
  );
}
