import React from "react";
import { DocumentActionProps } from "@sanity/base";
import { DefaultDocumentActions } from "sanity/desk";

export default function NoDeleteToolbar(props) {
  if (props.type === "siteSettings") {
    // Filter out the delete action
    const actions = DefaultDocumentActions.filter(
      (action) => action.name !== "delete"
    );
    return (
      <>
        {actions.map((Action, i) => (
          <Action key={i} {...props} />
        ))}
      </>
    );
  }

  // Default actions for other document types
  return <DefaultDocumentActions {...props} />;
}
