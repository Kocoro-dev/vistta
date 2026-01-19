"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateSectionContent, uploadAdminImage } from "@/actions/admin";
import { toast } from "sonner";
import { Save, Loader2, Upload, X, Plus, Trash2 } from "lucide-react";

interface ContentEditorProps {
  page: string;
  section: string;
  initialContent: Record<string, any>;
  fields: FieldConfig[];
  title: string;
  description?: string;
}

interface FieldConfig {
  key: string;
  label: string;
  type: "text" | "textarea" | "image" | "array" | "string-array" | "object";
  placeholder?: string;
  fields?: FieldConfig[]; // For nested objects/arrays
}

export function ContentEditor({
  page,
  section,
  initialContent,
  fields,
  title,
  description,
}: ContentEditorProps) {
  const router = useRouter();
  const [content, setContent] = useState(initialContent || {});
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const handleChange = (key: string, value: any) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  const handleNestedChange = (parentKey: string, index: number, key: string, value: any) => {
    setContent((prev) => {
      const array = [...(prev[parentKey] || [])];
      array[index] = { ...array[index], [key]: value };
      return { ...prev, [parentKey]: array };
    });
  };

  // For simple string arrays
  const handleStringArrayChange = (key: string, index: number, value: string) => {
    setContent((prev) => {
      const array = [...(prev[key] || [])];
      array[index] = value;
      return { ...prev, [key]: array };
    });
  };

  const handleAddArrayItem = (key: string, template: Record<string, any> | string) => {
    setContent((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), template],
    }));
  };

  const handleRemoveArrayItem = (key: string, index: number) => {
    setContent((prev) => ({
      ...prev,
      [key]: (prev[key] || []).filter((_: any, i: number) => i !== index),
    }));
  };

  const handleImageUpload = async (key: string, file: File, index?: number, nestedKey?: string) => {
    const fieldId = index !== undefined ? `${key}-${index}-${nestedKey}` : key;
    setUploadingField(fieldId);

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadAdminImage(formData);

    if (result.success && result.url) {
      if (index !== undefined && nestedKey) {
        handleNestedChange(key, index, nestedKey, result.url);
      } else {
        handleChange(key, result.url);
      }
      toast.success("Imagen subida correctamente");
    } else {
      toast.error(result.error || "Error al subir la imagen");
    }

    setUploadingField(null);
  };

  const handleSave = async () => {
    setIsSaving(true);

    const result = await updateSectionContent(page, section, content);

    if (result.success) {
      toast.success("Contenido guardado correctamente");
      router.refresh();
    } else {
      toast.error(result.error || "Error al guardar");
    }

    setIsSaving(false);
  };

  const renderField = (field: FieldConfig, value: any, onChange: (val: any) => void) => {
    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className="w-full h-10 px-3 bg-neutral-800 border border-neutral-700 text-white text-[13px] placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
          />
        );

      case "textarea":
        return (
          <textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 text-white text-[13px] placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors resize-y"
          />
        );

      case "image":
        return (
          <div className="space-y-2">
            {value && (
              <div className="relative w-full h-40 bg-neutral-800 border border-neutral-700 overflow-hidden">
                <img src={value} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="absolute top-2 right-2 h-6 w-6 bg-neutral-900/80 hover:bg-red-500 flex items-center justify-center transition-colors"
                >
                  <X className="h-3 w-3 text-white" />
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder="URL de la imagen"
                className="flex-1 h-10 px-3 bg-neutral-800 border border-neutral-700 text-white text-[13px] placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
              />
              <label className="h-10 px-4 bg-neutral-700 hover:bg-neutral-600 text-white text-[13px] font-medium flex items-center gap-2 cursor-pointer transition-colors">
                {uploadingField === field.key ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(field.key, file);
                  }}
                />
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[24px] font-medium text-white mb-2">{title}</h1>
          {description && (
            <p className="text-[14px] text-neutral-500">{description}</p>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 bg-white hover:bg-neutral-100 text-neutral-900 px-5 h-10 text-[13px] font-medium transition-colors disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Guardar Cambios
            </>
          )}
        </button>
      </div>

      {/* Fields */}
      <div className="space-y-6">
        {fields.map((field) => {
          // Handle simple string arrays
          if (field.type === "string-array") {
            const arrayValue = content[field.key] || [];
            return (
              <div key={field.key} className="bg-neutral-900 border border-neutral-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-[13px] font-medium text-neutral-400">
                    {field.label}
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddArrayItem(field.key, "")}
                    className="inline-flex items-center gap-1 text-[12px] text-neutral-500 hover:text-white transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    Añadir
                  </button>
                </div>

                <div className="space-y-2">
                  {arrayValue.map((item: string, index: number) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={item || ""}
                        onChange={(e) => handleStringArrayChange(field.key, index, e.target.value)}
                        placeholder={field.placeholder}
                        className="flex-1 h-9 px-3 bg-neutral-800 border border-neutral-700 text-white text-[12px] placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveArrayItem(field.key, index)}
                        className="h-9 w-9 bg-neutral-700 hover:bg-red-500 flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="h-3 w-3 text-white" />
                      </button>
                    </div>
                  ))}
                  {arrayValue.length === 0 && (
                    <p className="text-[12px] text-neutral-600 py-2">
                      No hay elementos. Haz clic en &quot;Añadir&quot; para agregar uno.
                    </p>
                  )}
                </div>
              </div>
            );
          }

          // Handle complex arrays (arrays of objects)
          if (field.type === "array" && field.fields) {
            return (
              <div key={field.key} className="bg-neutral-900 border border-neutral-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-[13px] font-medium text-neutral-400">
                    {field.label}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const template: Record<string, any> = {};
                      field.fields?.forEach((f) => {
                        template[f.key] = "";
                      });
                      handleAddArrayItem(field.key, template);
                    }}
                    className="inline-flex items-center gap-1 text-[12px] text-neutral-500 hover:text-white transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    Añadir
                  </button>
                </div>

                <div className="space-y-4">
                  {(content[field.key] || []).map((item: any, index: number) => (
                    <div
                      key={index}
                      className="relative bg-neutral-800/50 border border-neutral-700 p-4"
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveArrayItem(field.key, index)}
                        className="absolute top-2 right-2 h-6 w-6 bg-neutral-700 hover:bg-red-500 flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="h-3 w-3 text-white" />
                      </button>

                      <div className="space-y-3 pr-8">
                        {field.fields?.map((subField) => (
                          <div key={subField.key}>
                            <label className="block text-[12px] text-neutral-500 mb-1">
                              {subField.label}
                            </label>
                            {subField.type === "image" ? (
                              <div className="space-y-2">
                                {item[subField.key] && (
                                  <div className="relative w-full h-32 bg-neutral-800 border border-neutral-700 overflow-hidden">
                                    <img
                                      src={item[subField.key]}
                                      alt=""
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={item[subField.key] || ""}
                                    onChange={(e) =>
                                      handleNestedChange(field.key, index, subField.key, e.target.value)
                                    }
                                    placeholder="URL de la imagen"
                                    className="flex-1 h-9 px-3 bg-neutral-800 border border-neutral-700 text-white text-[12px] placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600"
                                  />
                                  <label className="h-9 px-3 bg-neutral-700 hover:bg-neutral-600 text-white text-[12px] flex items-center gap-1 cursor-pointer">
                                    {uploadingField === `${field.key}-${index}-${subField.key}` ? (
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                      <Upload className="h-3 w-3" />
                                    )}
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file)
                                          handleImageUpload(field.key, file, index, subField.key);
                                      }}
                                    />
                                  </label>
                                </div>
                              </div>
                            ) : subField.type === "textarea" ? (
                              <textarea
                                value={item[subField.key] || ""}
                                onChange={(e) =>
                                  handleNestedChange(field.key, index, subField.key, e.target.value)
                                }
                                rows={2}
                                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 text-white text-[12px] placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 resize-y"
                              />
                            ) : (
                              <input
                                type="text"
                                value={item[subField.key] || ""}
                                onChange={(e) =>
                                  handleNestedChange(field.key, index, subField.key, e.target.value)
                                }
                                placeholder={subField.placeholder}
                                className="w-full h-9 px-3 bg-neutral-800 border border-neutral-700 text-white text-[12px] placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {(content[field.key] || []).length === 0 && (
                    <p className="text-[12px] text-neutral-600 py-2">
                      No hay elementos. Haz clic en &quot;Añadir&quot; para agregar uno.
                    </p>
                  )}
                </div>
              </div>
            );
          }

          if (field.type === "object" && field.fields) {
            return (
              <div key={field.key} className="bg-neutral-900 border border-neutral-800 p-6">
                <label className="block text-[13px] font-medium text-neutral-400 mb-4">
                  {field.label}
                </label>
                <div className="space-y-3">
                  {field.fields.map((subField) => (
                    <div key={subField.key}>
                      <label className="block text-[12px] text-neutral-500 mb-1">
                        {subField.label}
                      </label>
                      {renderField(
                        subField,
                        content[field.key]?.[subField.key],
                        (val) =>
                          handleChange(field.key, {
                            ...(content[field.key] || {}),
                            [subField.key]: val,
                          })
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          return (
            <div key={field.key} className="bg-neutral-900 border border-neutral-800 p-6">
              <label className="block text-[13px] font-medium text-neutral-400 mb-3">
                {field.label}
              </label>
              {renderField(field, content[field.key], (val) => handleChange(field.key, val))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
