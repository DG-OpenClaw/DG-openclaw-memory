"use client";

import { useMemo, useState } from "react";
import {
  calculateEstimate,
  cmsOptions,
  defaultEstimateValues,
  designTypeOptions,
  formatCurrency,
  mockEstimates,
  pricingRows,
  siteTypeOptions,
  type EstimateFormValues,
} from "@/lib/estimate";

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
        {description ? <p className="mt-1 text-sm text-zinc-500">{description}</p> : null}
      </div>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm text-zinc-700">
      <span className="font-medium">{label}</span>
      {children}
    </label>
  );
}

function inputClassName() {
  return "w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-400";
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-zinc-950">{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{sub}</p>
    </div>
  );
}

export default function Home() {
  const [values, setValues] = useState<EstimateFormValues>(defaultEstimateValues);

  const result = useMemo(() => calculateEstimate(values), [values]);

  const setValue = <K extends keyof EstimateFormValues>(key: K, value: EstimateFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const estimateCount = mockEstimates.length.toString();
  const draftCount = mockEstimates.filter((item) => item.status === "下書き").length.toString();
  const proposedCount = mockEstimates.filter((item) => item.status === "提案中").length.toString();
  const wonTotal = formatCurrency(
    mockEstimates.filter((item) => item.status === "成約").reduce((sum, item) => sum + item.total, 0),
  );

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:px-6 lg:px-8">
        <section className="rounded-3xl bg-zinc-950 px-6 py-8 text-white shadow-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-zinc-400">Web Estimate App</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">ホームページ制作 見積システム</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-300 md:text-base">
                ページ数、CMS、フォーム、オプション機能に応じて制作費を自動計算する管理画面付きMVP。
                今回は仕様書と合わせて、見積入力・自動計算・一覧・料金マスタのモックUIまで着手済み。
              </p>
            </div>
            <div className="grid gap-3 text-sm text-zinc-300 sm:grid-cols-3 lg:w-[420px]">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-zinc-400">Next.js</p>
                <p className="mt-2 font-semibold text-white">App Router</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-zinc-400">DB候補</p>
                <p className="mt-2 font-semibold text-white">Supabase</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-zinc-400">現状</p>
                <p className="mt-2 font-semibold text-white">MVPモック</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="総見積件数" value={estimateCount} sub="保存済みダミーデータ" />
          <StatCard label="下書き" value={draftCount} sub="営業が編集中" />
          <StatCard label="提案中" value={proposedCount} sub="顧客提示待ち" />
          <StatCard label="成約金額" value={wonTotal} sub="成約案件の合計" />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="flex flex-col gap-6">
            <Section title="基本情報" description="案件の基本情報と見積前提を入力します。">
              <Field label="案件名">
                <input className={inputClassName()} value={values.projectName} onChange={(e) => setValue("projectName", e.target.value)} />
              </Field>
              <Field label="顧客名">
                <input className={inputClassName()} value={values.clientName} onChange={(e) => setValue("clientName", e.target.value)} />
              </Field>
              <Field label="担当者名">
                <input className={inputClassName()} value={values.contactPerson} onChange={(e) => setValue("contactPerson", e.target.value)} />
              </Field>
              <Field label="サイト種別">
                <select className={inputClassName()} value={values.siteType} onChange={(e) => setValue("siteType", e.target.value as EstimateFormValues["siteType"])}>
                  {siteTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>
            </Section>

            <Section title="デザイン / CMS" description="デザイン方式とCMS導入条件を設定します。">
              <Field label="デザイン方式">
                <select className={inputClassName()} value={values.designType} onChange={(e) => setValue("designType", e.target.value as EstimateFormValues["designType"])}>
                  {designTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="CMS種別">
                <select className={inputClassName()} value={values.cmsType} onChange={(e) => setValue("cmsType", e.target.value as EstimateFormValues["cmsType"])}>
                  {cmsOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="投稿タイプ数">
                <input className={inputClassName()} type="number" min={0} value={values.cmsPostTypeCount} onChange={(e) => setValue("cmsPostTypeCount", Number(e.target.value))} />
              </Field>
              <label className="flex items-center gap-3 rounded-xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700">
                <input type="checkbox" checked={values.adminCustomization} onChange={(e) => setValue("adminCustomization", e.target.checked)} />
                管理画面カスタマイズを含む
              </label>
            </Section>

            <Section title="ページ構成" description="ページ数で見積金額が変動します。">
              <Field label="トップページ数">
                <input className={inputClassName()} type="number" min={0} value={values.topPageCount} onChange={(e) => setValue("topPageCount", Number(e.target.value))} />
              </Field>
              <Field label="下層テンプレページ数">
                <input className={inputClassName()} type="number" min={0} value={values.templatePageCount} onChange={(e) => setValue("templatePageCount", Number(e.target.value))} />
              </Field>
              <Field label="下層オリジナルページ数">
                <input className={inputClassName()} type="number" min={0} value={values.customPageCount} onChange={(e) => setValue("customPageCount", Number(e.target.value))} />
              </Field>
              <Field label="ブログ一覧テンプレート数">
                <input className={inputClassName()} type="number" min={0} value={values.blogIndexCount} onChange={(e) => setValue("blogIndexCount", Number(e.target.value))} />
              </Field>
              <Field label="ブログ詳細テンプレート数">
                <input className={inputClassName()} type="number" min={0} value={values.blogDetailCount} onChange={(e) => setValue("blogDetailCount", Number(e.target.value))} />
              </Field>
              <Field label="原稿作成ページ数">
                <input className={inputClassName()} type="number" min={0} value={values.copywritingPageCount} onChange={(e) => setValue("copywritingPageCount", Number(e.target.value))} />
              </Field>
            </Section>

            <Section title="フォーム / オプション" description="フォーム数や追加機能の有無を設定します。">
              <Field label="問い合わせフォーム数">
                <input className={inputClassName()} type="number" min={0} value={values.contactFormCount} onChange={(e) => setValue("contactFormCount", Number(e.target.value))} />
              </Field>
              <Field label="確認画面数">
                <input className={inputClassName()} type="number" min={0} value={values.confirmPageCount} onChange={(e) => setValue("confirmPageCount", Number(e.target.value))} />
              </Field>
              <Field label="自動返信数">
                <input className={inputClassName()} type="number" min={0} value={values.autoReplyCount} onChange={(e) => setValue("autoReplyCount", Number(e.target.value))} />
              </Field>
              <Field label="ファイル添付数">
                <input className={inputClassName()} type="number" min={0} value={values.fileUploadCount} onChange={(e) => setValue("fileUploadCount", Number(e.target.value))} />
              </Field>
              <Field label="多言語対応数">
                <input className={inputClassName()} type="number" min={0} value={values.multilingualCount} onChange={(e) => setValue("multilingualCount", Number(e.target.value))} />
              </Field>
              <div className="grid gap-3 md:col-span-2 md:grid-cols-2">
                {[
                  ["seoSetup", "SEO初期設定"],
                  ["serverDomainSetup", "サーバー / ドメイン設定"],
                  ["photoShoot", "写真撮影"],
                  ["maintenance", "保守契約"],
                  ["reservation", "予約機能"],
                  ["searchFunction", "検索機能"],
                  ["apiIntegration", "API連携"],
                  ["animation", "アニメーション"],
                ].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-3 rounded-xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700">
                    <input
                      type="checkbox"
                      checked={values[key as keyof EstimateFormValues] as boolean}
                      onChange={(e) => setValue(key as keyof EstimateFormValues, e.target.checked as never)}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </Section>

            <Section title="値引き / 税" description="値引き額または率を反映して最終見積を計算します。">
              <Field label="値引き種別">
                <select className={inputClassName()} value={values.discountType} onChange={(e) => setValue("discountType", e.target.value as EstimateFormValues["discountType"])}>
                  <option value="fixed">固定額</option>
                  <option value="rate">率（%）</option>
                </select>
              </Field>
              <Field label={values.discountType === "rate" ? "値引き率（%）" : "値引き額（円）"}>
                <input className={inputClassName()} type="number" min={0} value={values.discountValue} onChange={(e) => setValue("discountValue", Number(e.target.value))} />
              </Field>
              <Field label="税率">
                <input className={inputClassName()} type="number" min={0} step={0.01} value={values.taxRate} onChange={(e) => setValue("taxRate", Number(e.target.value))} />
              </Field>
              <Field label="備考">
                <textarea className={`${inputClassName()} min-h-24`} value={values.note} onChange={(e) => setValue("note", e.target.value)} />
              </Field>
            </Section>
          </div>

          <aside className="flex flex-col gap-6 xl:sticky xl:top-6 xl:self-start">
            <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-zinc-900">見積サマリー</h2>
              <p className="mt-1 text-sm text-zinc-500">入力内容に応じてリアルタイム計算</p>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between text-zinc-600">
                  <span>小計</span>
                  <span className="font-medium text-zinc-950">{formatCurrency(result.subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-600">
                  <span>値引き</span>
                  <span className="font-medium text-rose-600">- {formatCurrency(result.discountAmount)}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-600">
                  <span>課税対象額</span>
                  <span className="font-medium text-zinc-950">{formatCurrency(result.taxableAmount)}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-600">
                  <span>消費税</span>
                  <span className="font-medium text-zinc-950">{formatCurrency(result.taxAmount)}</span>
                </div>
                <div className="mt-4 rounded-2xl bg-zinc-950 px-4 py-5 text-white">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Total</p>
                  <p className="mt-2 text-3xl font-semibold">{formatCurrency(result.total)}</p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-zinc-900">見積内訳</h2>
              <div className="mt-4 space-y-3">
                {result.items.map((item) => (
                  <div key={`${item.category}-${item.label}`} className="rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">{item.category}</p>
                        <p className="mt-1 text-sm font-medium text-zinc-900">{item.label}</p>
                        <p className="mt-1 text-xs text-zinc-500">
                          {formatCurrency(item.unitPrice)} × {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-zinc-950">{formatCurrency(item.amount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">見積一覧モック</h2>
                <p className="mt-1 text-sm text-zinc-500">保存・検索・ステータス管理画面のたたき台</p>
              </div>
              <button className="rounded-xl bg-zinc-950 px-4 py-2 text-sm font-medium text-white">新規作成</button>
            </div>
            <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-200">
              <table className="min-w-full divide-y divide-zinc-200 text-sm">
                <thead className="bg-zinc-50 text-left text-zinc-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">見積ID</th>
                    <th className="px-4 py-3 font-medium">案件名</th>
                    <th className="px-4 py-3 font-medium">顧客</th>
                    <th className="px-4 py-3 font-medium">状態</th>
                    <th className="px-4 py-3 font-medium">合計</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 bg-white">
                  {mockEstimates.map((estimate) => (
                    <tr key={estimate.id}>
                      <td className="px-4 py-3 font-medium text-zinc-900">{estimate.id}</td>
                      <td className="px-4 py-3 text-zinc-700">{estimate.projectName}</td>
                      <td className="px-4 py-3 text-zinc-600">{estimate.clientName}</td>
                      <td className="px-4 py-3 text-zinc-600">{estimate.status}</td>
                      <td className="px-4 py-3 font-medium text-zinc-900">{formatCurrency(estimate.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">料金マスタモック</h2>
            <p className="mt-1 text-sm text-zinc-500">将来的にSupabaseで編集可能にする前提の初期マスタ</p>
            <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-200">
              <table className="min-w-full divide-y divide-zinc-200 text-sm">
                <thead className="bg-zinc-50 text-left text-zinc-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">カテゴリ</th>
                    <th className="px-4 py-3 font-medium">項目</th>
                    <th className="px-4 py-3 font-medium">単価</th>
                    <th className="px-4 py-3 font-medium">単位</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 bg-white">
                  {pricingRows.map((row) => (
                    <tr key={row.code}>
                      <td className="px-4 py-3 text-zinc-600">{row.category}</td>
                      <td className="px-4 py-3 font-medium text-zinc-900">{row.label}</td>
                      <td className="px-4 py-3 text-zinc-900">{formatCurrency(row.unitPrice)}</td>
                      <td className="px-4 py-3 text-zinc-600">{row.unitType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
