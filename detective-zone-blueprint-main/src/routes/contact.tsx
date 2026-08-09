import { createFileRoute } from "@tanstack/react-router";
import DetectiveContactPage from "@/components/templates/DetectiveContactPage";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Detective Zone" },
      {
        name: "description",
        content:
          "Every investigation starts with a conversation. Report a clue, request assistance or explore partnership opportunities with the Detective Zone team.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return <DetectiveContactPage embedded />;
}
