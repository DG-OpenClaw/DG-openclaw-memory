export type SiteType = "corporate" | "lp" | "recruit" | "service" | "ec";
export type DesignType = "template" | "semi_order" | "full_custom";
export type CmsType = "none" | "wordpress" | "microcms" | "headless";
export type EstimateStatus = "draft" | "proposed" | "won" | "lost";
export type DiscountType = "fixed" | "rate";

export type EstimateFormValues = {
  projectName: string;
  clientName: string;
  contactPerson: string;
  siteType: SiteType;
  designType: DesignType;
  cmsType: CmsType;
  topPageCount: number;
  templatePageCount: number;
  customPageCount: number;
  blogIndexCount: number;
  blogDetailCount: number;
  cmsPostTypeCount: number;
  adminCustomization: boolean;
  contactFormCount: number;
  confirmPageCount: number;
  autoReplyCount: number;
  fileUploadCount: number;
  seoSetup: boolean;
  serverDomainSetup: boolean;
  photoShoot: boolean;
  maintenance: boolean;
  multilingualCount: number;
  reservation: boolean;
  searchFunction: boolean;
  apiIntegration: boolean;
  copywritingPageCount: number;
  animation: boolean;
  discountType: DiscountType;
  discountValue: number;
  taxRate: number;
  note: string;
};

export type EstimateItem = {
  category: string;
  label: string;
  unitPrice: number;
  quantity: number;
  amount: number;
};

export type EstimateResult = {
  items: EstimateItem[];
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  total: number;
};

export const siteTypeOptions: { value: SiteType; label: string }[] = [
  { value: "corporate", label: "コーポレートサイト" },
  { value: "lp", label: "LP" },
  { value: "recruit", label: "採用サイト" },
  { value: "service", label: "サービスサイト" },
  { value: "ec", label: "ECサイト" },
];

export const designTypeOptions: { value: DesignType; label: string }[] = [
  { value: "template", label: "テンプレート" },
  { value: "semi_order", label: "セミオーダー" },
  { value: "full_custom", label: "フルオリジナル" },
];

export const cmsOptions: { value: CmsType; label: string }[] = [
  { value: "none", label: "なし" },
  { value: "wordpress", label: "WordPress" },
  { value: "microcms", label: "microCMS" },
  { value: "headless", label: "Headless CMS" },
];

export const statusOptions: { value: EstimateStatus; label: string }[] = [
  { value: "draft", label: "下書き" },
  { value: "proposed", label: "提案中" },
  { value: "won", label: "成約" },
  { value: "lost", label: "失注" },
];

export const pricing = {
  siteBase: {
    corporate: 150000,
    lp: 100000,
    recruit: 180000,
    service: 200000,
    ec: 300000,
  },
  design: {
    template: 0,
    semi_order: 80000,
    full_custom: 200000,
  },
  pages: {
    template: 10000,
    custom: 20000,
    blogIndex: 20000,
    blogDetail: 30000,
  },
  cms: {
    wordpress: 80000,
    microcms: 100000,
    headless: 120000,
    postType: 25000,
    adminCustomization: 30000,
  },
  forms: {
    contact: 20000,
    confirm: 10000,
    autoReply: 5000,
    fileUpload: 10000,
  },
  options: {
    seoSetup: 20000,
    serverDomainSetup: 30000,
    photoShoot: 50000,
    maintenance: 30000,
    multilingual: 80000,
    reservation: 80000,
    searchFunction: 50000,
    apiIntegration: 100000,
    copywriting: 15000,
    animation: 30000,
  },
} as const;

export const defaultEstimateValues: EstimateFormValues = {
  projectName: "コーポレートサイト刷新",
  clientName: "株式会社サンプル",
  contactPerson: "山田 太郎",
  siteType: "corporate",
  designType: "semi_order",
  cmsType: "wordpress",
  topPageCount: 1,
  templatePageCount: 5,
  customPageCount: 3,
  blogIndexCount: 1,
  blogDetailCount: 1,
  cmsPostTypeCount: 2,
  adminCustomization: true,
  contactFormCount: 1,
  confirmPageCount: 1,
  autoReplyCount: 1,
  fileUploadCount: 0,
  seoSetup: true,
  serverDomainSetup: true,
  photoShoot: false,
  maintenance: true,
  multilingualCount: 0,
  reservation: false,
  searchFunction: false,
  apiIntegration: false,
  copywritingPageCount: 2,
  animation: true,
  discountType: "fixed",
  discountValue: 0,
  taxRate: 0.1,
  note: "まずは概算見積。正式見積で調整予定。",
};

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value);
}

function pushItem(items: EstimateItem[], category: string, label: string, unitPrice: number, quantity: number) {
  if (quantity <= 0 || unitPrice <= 0) return;

  items.push({
    category,
    label,
    unitPrice,
    quantity,
    amount: unitPrice * quantity,
  });
}

export function calculateEstimate(values: EstimateFormValues): EstimateResult {
  const items: EstimateItem[] = [];

  pushItem(items, "基本料金", siteTypeOptions.find((option) => option.value === values.siteType)?.label ?? values.siteType, pricing.siteBase[values.siteType], 1);
  pushItem(items, "デザイン", designTypeOptions.find((option) => option.value === values.designType)?.label ?? values.designType, pricing.design[values.designType], 1);
  pushItem(items, "ページ制作", "下層テンプレページ", pricing.pages.template, values.templatePageCount);
  pushItem(items, "ページ制作", "下層オリジナルページ", pricing.pages.custom, values.customPageCount);
  pushItem(items, "ページ制作", "ブログ一覧テンプレート", pricing.pages.blogIndex, values.blogIndexCount);
  pushItem(items, "ページ制作", "ブログ詳細テンプレート", pricing.pages.blogDetail, values.blogDetailCount);

  if (values.cmsType !== "none") {
    const cmsBase = values.cmsType === "wordpress" ? pricing.cms.wordpress : values.cmsType === "microcms" ? pricing.cms.microcms : pricing.cms.headless;
    pushItem(items, "CMS", `${cmsOptions.find((option) => option.value === values.cmsType)?.label} 導入`, cmsBase, 1);
    pushItem(items, "CMS", "投稿タイプ追加", pricing.cms.postType, values.cmsPostTypeCount);
    pushItem(items, "CMS", "管理画面カスタマイズ", pricing.cms.adminCustomization, values.adminCustomization ? 1 : 0);
  }

  pushItem(items, "フォーム", "問い合わせフォーム", pricing.forms.contact, values.contactFormCount);
  pushItem(items, "フォーム", "確認画面", pricing.forms.confirm, values.confirmPageCount);
  pushItem(items, "フォーム", "自動返信", pricing.forms.autoReply, values.autoReplyCount);
  pushItem(items, "フォーム", "ファイル添付", pricing.forms.fileUpload, values.fileUploadCount);

  pushItem(items, "オプション", "SEO初期設定", pricing.options.seoSetup, values.seoSetup ? 1 : 0);
  pushItem(items, "オプション", "サーバー / ドメイン設定", pricing.options.serverDomainSetup, values.serverDomainSetup ? 1 : 0);
  pushItem(items, "オプション", "写真撮影", pricing.options.photoShoot, values.photoShoot ? 1 : 0);
  pushItem(items, "オプション", "保守契約初期設定", pricing.options.maintenance, values.maintenance ? 1 : 0);
  pushItem(items, "オプション", "多言語対応", pricing.options.multilingual, values.multilingualCount);
  pushItem(items, "オプション", "予約機能", pricing.options.reservation, values.reservation ? 1 : 0);
  pushItem(items, "オプション", "検索機能", pricing.options.searchFunction, values.searchFunction ? 1 : 0);
  pushItem(items, "オプション", "API連携", pricing.options.apiIntegration, values.apiIntegration ? 1 : 0);
  pushItem(items, "オプション", "原稿作成", pricing.options.copywriting, values.copywritingPageCount);
  pushItem(items, "オプション", "アニメーション", pricing.options.animation, values.animation ? 1 : 0);

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const rawDiscount = values.discountType === "rate" ? subtotal * (values.discountValue / 100) : values.discountValue;
  const discountAmount = Math.max(0, Math.min(Math.round(rawDiscount), subtotal));
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round(taxableAmount * values.taxRate);
  const total = taxableAmount + taxAmount;

  return {
    items,
    subtotal,
    discountAmount,
    taxableAmount,
    taxAmount,
    total,
  };
}

export const mockEstimates = [
  {
    id: "EST-20260310-001",
    projectName: "株式会社サンプル コーポレートサイト刷新",
    clientName: "株式会社サンプル",
    siteType: "コーポレートサイト",
    status: "下書き",
    total: 731500,
    updatedAt: "2026-03-10 14:20",
  },
  {
    id: "EST-20260309-014",
    projectName: "採用LP制作",
    clientName: "Bright Swan LLC",
    siteType: "LP",
    status: "提案中",
    total: 418000,
    updatedAt: "2026-03-09 18:40",
  },
  {
    id: "EST-20260308-006",
    projectName: "サービスサイト多言語化",
    clientName: "Sky Link Inc.",
    siteType: "サービスサイト",
    status: "成約",
    total: 1210000,
    updatedAt: "2026-03-08 09:10",
  },
];

export const pricingRows = [
  { category: "基本料金", code: "corporate", label: "コーポレートサイト", unitPrice: pricing.siteBase.corporate, unitType: "式" },
  { category: "基本料金", code: "lp", label: "LP", unitPrice: pricing.siteBase.lp, unitType: "式" },
  { category: "デザイン", code: "semi_order", label: "セミオーダー", unitPrice: pricing.design.semi_order, unitType: "式" },
  { category: "ページ制作", code: "template_page", label: "下層テンプレページ", unitPrice: pricing.pages.template, unitType: "ページ" },
  { category: "CMS", code: "wordpress", label: "WordPress導入", unitPrice: pricing.cms.wordpress, unitType: "式" },
  { category: "フォーム", code: "contact_form", label: "問い合わせフォーム", unitPrice: pricing.forms.contact, unitType: "本" },
  { category: "オプション", code: "seo_setup", label: "SEO初期設定", unitPrice: pricing.options.seoSetup, unitType: "式" },
  { category: "オプション", code: "api_integration", label: "API連携", unitPrice: pricing.options.apiIntegration, unitType: "式" },
];
