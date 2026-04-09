import { useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useSubmit, useNavigation } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  Button,
  BlockStack,
  InlineStack,
  Text,
  TextField,
  IndexTable,
  Badge,
  EmptyState,
  Modal,
  FormLayout,
  Banner,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  const artists = await prisma.artist.findMany({ orderBy: { id: "asc" } });
  return { artists };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  await authenticate.admin(request);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "create") {
    const name = (formData.get("name") as string | null)?.trim();
    if (!name) return { error: "Name is required" };
    await prisma.artist.create({ data: { name } });
  } else if (intent === "update") {
    const id = parseInt(formData.get("id") as string, 10);
    const name = (formData.get("name") as string | null)?.trim();
    if (!name) return { error: "Name is required" };
    await prisma.artist.update({ where: { id }, data: { name } });
  } else if (intent === "toggle") {
    const id = parseInt(formData.get("id") as string, 10);
    const current = formData.get("isActive") === "true";
    await prisma.artist.update({
      where: { id },
      data: { isActive: !current },
    });
  } else if (intent === "delete") {
    const id = parseInt(formData.get("id") as string, 10);
    await prisma.artist.delete({ where: { id } });
  }

  return null;
};

type Artist = {
  id: number;
  name: string;
  isActive: boolean;
};

export default function ArtistsPage() {
  const { artists } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editArtist, setEditArtist] = useState<Artist | null>(null);
  const [newName, setNewName] = useState("");
  const [editName, setEditName] = useState("");
  const [addError, setAddError] = useState("");
  const [editError, setEditError] = useState("");

  function handleAdd() {
    if (!newName.trim()) {
      setAddError("Name is required");
      return;
    }
    const formData = new FormData();
    formData.set("intent", "create");
    formData.set("name", newName.trim());
    submit(formData, { method: "post" });
    setNewName("");
    setAddError("");
    setAddModalOpen(false);
  }

  function handleEdit() {
    if (!editName.trim()) {
      setEditError("Name is required");
      return;
    }
    const formData = new FormData();
    formData.set("intent", "update");
    formData.set("id", String(editArtist!.id));
    formData.set("name", editName.trim());
    submit(formData, { method: "post" });
    setEditError("");
    setEditModalOpen(false);
  }

  function handleToggle(artist: Artist) {
    const formData = new FormData();
    formData.set("intent", "toggle");
    formData.set("id", String(artist.id));
    formData.set("isActive", String(artist.isActive));
    submit(formData, { method: "post" });
  }

  function handleDelete(artist: Artist) {
    if (!confirm(`Delete "${artist.name}"? This cannot be undone.`)) return;
    const formData = new FormData();
    formData.set("intent", "delete");
    formData.set("id", String(artist.id));
    submit(formData, { method: "post" });
  }

  function openEditModal(artist: Artist) {
    setEditArtist(artist);
    setEditName(artist.name);
    setEditError("");
    setEditModalOpen(true);
  }

  const rowMarkup = artists.map((artist, index) => (
    <IndexTable.Row id={String(artist.id)} key={artist.id} position={index}>
      <IndexTable.Cell>
        <Text as="span" variant="bodyMd">
          {artist.id}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" variant="bodyMd" fontWeight="semibold">
          {artist.name}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Badge tone={artist.isActive ? "success" : "critical"}>
          {artist.isActive ? "Active" : "Inactive"}
        </Badge>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <InlineStack gap="200">
          <Button
            size="slim"
            onClick={() => openEditModal(artist as Artist)}
            disabled={isSubmitting}
          >
            Edit
          </Button>
          <Button
            size="slim"
            onClick={() => handleToggle(artist as Artist)}
            disabled={isSubmitting}
            tone={artist.isActive ? "critical" : undefined}
          >
            {artist.isActive ? "Deactivate" : "Activate"}
          </Button>
          <Button
            size="slim"
            tone="critical"
            onClick={() => handleDelete(artist as Artist)}
            disabled={isSubmitting}
          >
            Delete
          </Button>
        </InlineStack>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <Page>
      <TitleBar title="Artists">
        <button variant="primary" onClick={() => setAddModalOpen(true)}>
          Add artist
        </button>
      </TitleBar>

      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card padding="0">
              {artists.length === 0 ? (
                <EmptyState
                  heading="No artists yet"
                  image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                  action={{
                    content: "Add your first artist",
                    onAction: () => setAddModalOpen(true),
                  }}
                >
                  <p>Add artists to manage them here.</p>
                </EmptyState>
              ) : (
                <IndexTable
                  resourceName={{ singular: "artist", plural: "artists" }}
                  itemCount={artists.length}
                  headings={[
                    { title: "ID" },
                    { title: "Name" },
                    { title: "Status" },
                    { title: "Actions" },
                  ]}
                  selectable={false}
                >
                  {rowMarkup}
                </IndexTable>
              )}
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>

      <Modal
        open={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setNewName("");
          setAddError("");
        }}
        title="Add artist"
        primaryAction={{ content: "Add", onAction: handleAdd }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => {
              setAddModalOpen(false);
              setNewName("");
              setAddError("");
            },
          },
        ]}
      >
        <Modal.Section>
          <FormLayout>
            {addError && (
              <Banner tone="critical">
                <p>{addError}</p>
              </Banner>
            )}
            <TextField
              label="Artist name"
              value={newName}
              onChange={setNewName}
              autoComplete="off"
              placeholder="e.g. Taylor Swift"
            />
          </FormLayout>
        </Modal.Section>
      </Modal>

      <Modal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditError("");
        }}
        title={`Edit: ${editArtist?.name ?? ""}`}
        primaryAction={{ content: "Save", onAction: handleEdit }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => {
              setEditModalOpen(false);
              setEditError("");
            },
          },
        ]}
      >
        <Modal.Section>
          <FormLayout>
            {editError && (
              <Banner tone="critical">
                <p>{editError}</p>
              </Banner>
            )}
            <TextField
              label="Artist name"
              value={editName}
              onChange={setEditName}
              autoComplete="off"
            />
          </FormLayout>
        </Modal.Section>
      </Modal>
    </Page>
  );
}
