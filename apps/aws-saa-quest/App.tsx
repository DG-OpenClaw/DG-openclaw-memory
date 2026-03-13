import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Topic = 'IAM' | 'EC2' | 'S3' | 'VPC' | 'RDS';

type Quiz = {
  id: number;
  topic: Topic;
  question: string;
  choices: string[];
  answer: number;
  explanation: string;
  difficulty: 'easy' | 'normal';
};

const quizzes: Quiz[] = [
  {
    id: 1,
    topic: 'IAM',
    difficulty: 'easy',
    question: 'EC2 から S3 に安全にアクセスさせたい。最も適切なのは？',
    choices: [
      'EC2 に Access Key を直接保存する',
      'IAM ロールを EC2 に付与する',
      'S3 をパブリック公開する',
      'セキュリティグループで S3 を許可する',
    ],
    answer: 1,
    explanation:
      'EC2 から AWS サービスへ安全に権限を渡すなら IAM ロールが基本。Access Key の直置きは避ける。',
  },
  {
    id: 2,
    topic: 'S3',
    difficulty: 'easy',
    question: 'S3 の主な特徴として正しいものは？',
    choices: [
      'ブロックストレージである',
      'ファイルシステムを直接マウントする前提である',
      'オブジェクトストレージで高耐久性がある',
      '必ず単一 AZ にしか置けない',
    ],
    answer: 2,
    explanation:
      'S3 はオブジェクトストレージ。EBS はブロック、EFS はファイルストレージ。',
  },
  {
    id: 3,
    topic: 'RDS',
    difficulty: 'normal',
    question: 'RDS の Multi-AZ 配置の主目的は？',
    choices: ['読み取り性能の向上', '可用性の向上', '保存容量の拡大', 'SQL 文の高速化'],
    answer: 1,
    explanation:
      'Multi-AZ は障害対策・可用性向上が目的。読み取り性能向上は Read Replica。',
  },
  {
    id: 4,
    topic: 'VPC',
    difficulty: 'normal',
    question: 'プライベートサブネットの EC2 がインターネットへアウトバウンド接続する時に必要になりやすいのは？',
    choices: ['Internet Gateway', 'NAT Gateway', 'Route 53', 'Security Hub'],
    answer: 1,
    explanation:
      'プライベートサブネットから外へ出る代表解は NAT Gateway。IGW は通常パブリック側で使う。',
  },
  {
    id: 5,
    topic: 'EC2',
    difficulty: 'easy',
    question: '短時間の中断が許容でき、最も安く計算リソースを使いたい。向いている購入オプションは？',
    choices: ['オンデマンド', 'Dedicated Host', 'スポットインスタンス', 'Savings Plans だけ'],
    answer: 2,
    explanation:
      '中断許容ならスポットが最安クラス。安定性優先ならオンデマンドや Reserved 系。',
  },
];

const topics: { topic: Topic; subtitle: string; color: string }[] = [
  { topic: 'IAM', subtitle: '権限の土台', color: '#7c3aed' },
  { topic: 'EC2', subtitle: '計算リソース', color: '#2563eb' },
  { topic: 'S3', subtitle: '最頻出ストレージ', color: '#059669' },
  { topic: 'VPC', subtitle: 'ネットワークの壁', color: '#ea580c' },
  { topic: 'RDS', subtitle: 'DB 設計の基本', color: '#dc2626' },
];

const dailyMissions = [
  'IAM と ロールの違いを説明できるようにする',
  'S3 / EBS / EFS の違いを比較する',
  'Multi-AZ と Read Replica を混同しない',
  'VPC の public / private subnet を図で理解する',
];

export default function App() {
  const [screen, setScreen] = useState<'home' | 'quiz' | 'review'>('home');
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finishedTopics, setFinishedTopics] = useState<Topic[]>([]);
  const [wrongTopics, setWrongTopics] = useState<Topic[]>([]);

  const mission = useMemo(() => {
    const day = new Date().getDate();
    return dailyMissions[day % dailyMissions.length];
  }, []);

  const currentQuiz = quizzes[index];
  const total = quizzes.length;
  const progress = Math.round((index / total) * 100);

  const startQuiz = () => {
    setScreen('quiz');
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinishedTopics([]);
    setWrongTopics([]);
  };

  const submitAnswer = () => {
    if (selected === null) return;

    const isCorrect = selected === currentQuiz.answer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    } else {
      setWrongTopics((prev) => [...prev, currentQuiz.topic]);
    }

    setFinishedTopics((prev) =>
      prev.includes(currentQuiz.topic) ? prev : [...prev, currentQuiz.topic],
    );

    if (index === total - 1) {
      setScreen('review');
      return;
    }

    setIndex((prev) => prev + 1);
    setSelected(null);
  };

  const accuracy = Math.round((score / total) * 100);
  const focusTopic = wrongTopics[0] ?? 'IAM';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        {screen === 'home' && (
          <>
            <Text style={styles.eyebrow}>AWS SAA 学習ゲーム</Text>
            <Text style={styles.title}>Cloud Quest</Text>
            <Text style={styles.subtitle}>
              未経験からでも、毎日ちょっとずつ進める SAA 学習アプリのたたき台。
            </Text>

            <View style={styles.heroCard}>
              <Text style={styles.heroLabel}>今日のデイリーミッション</Text>
              <Text style={styles.heroMission}>{mission}</Text>
              <Text style={styles.heroHint}>10分だけでも前進したら勝ち。</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>学習マップ</Text>
              {topics.map((item, idx) => (
                <View key={item.topic} style={styles.topicRow}>
                  <View style={[styles.topicBadge, { backgroundColor: item.color }]}>
                    <Text style={styles.topicBadgeText}>{idx + 1}</Text>
                  </View>
                  <View style={styles.topicTextWrap}>
                    <Text style={styles.topicTitle}>{item.topic}</Text>
                    <Text style={styles.topicSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>ゲーム要素</Text>
              <Text style={styles.bullet}>• 正解で EXP を獲得</Text>
              <Text style={styles.bullet}>• 苦手分野は夜に再出題</Text>
              <Text style={styles.bullet}>• 模試はボス戦っぽく拡張可能</Text>
            </View>

            <Pressable style={styles.primaryButton} onPress={startQuiz}>
              <Text style={styles.primaryButtonText}>クエスト開始</Text>
            </Pressable>
          </>
        )}

        {screen === 'quiz' && (
          <>
            <Text style={styles.eyebrow}>Quest {index + 1}</Text>
            <Text style={styles.progressText}>進捗 {progress}%</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${((index + 1) / total) * 100}%` }]} />
            </View>

            <View style={styles.quizCard}>
              <Text style={styles.quizMeta}>
                {currentQuiz.topic} / {currentQuiz.difficulty}
              </Text>
              <Text style={styles.quizQuestion}>{currentQuiz.question}</Text>

              {currentQuiz.choices.map((choice, choiceIndex) => {
                const active = selected === choiceIndex;
                return (
                  <Pressable
                    key={choice}
                    onPress={() => setSelected(choiceIndex)}
                    style={[styles.choiceButton, active && styles.choiceButtonActive]}
                  >
                    <Text style={[styles.choiceText, active && styles.choiceTextActive]}>
                      {choice}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.explanationCard}>
              <Text style={styles.explanationTitle}>学習メモ</Text>
              <Text style={styles.explanationText}>{currentQuiz.explanation}</Text>
            </View>

            <Pressable
              style={[styles.primaryButton, selected === null && styles.buttonDisabled]}
              onPress={submitAnswer}
              disabled={selected === null}
            >
              <Text style={styles.primaryButtonText}>
                {index === total - 1 ? '結果を見る' : '次へ'}
              </Text>
            </Pressable>
          </>
        )}

        {screen === 'review' && (
          <>
            <Text style={styles.eyebrow}>結果</Text>
            <Text style={styles.title}>{accuracy}%</Text>
            <Text style={styles.subtitle}>
              {score} / {total} 正解。最初の MVP としては十分。次は復習ループを育てる。
            </Text>

            <View style={styles.heroCard}>
              <Text style={styles.heroLabel}>次にやるべきこと</Text>
              <Text style={styles.heroMission}>重点復習テーマ: {focusTopic}</Text>
              <Text style={styles.heroHint}>
                間違えた分野を夜にもう一度出す設計にすると、かなりゲームっぽくなる。
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>今回進んだ分野</Text>
              {finishedTopics.map((topic) => (
                <Text key={topic} style={styles.bullet}>
                  • {topic}
                </Text>
              ))}
            </View>

            <Pressable style={styles.primaryButton} onPress={() => setScreen('home')}>
              <Text style={styles.primaryButtonText}>ホームへ戻る</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0b1020',
  },
  container: {
    padding: 20,
    paddingBottom: 48,
    gap: 16,
  },
  eyebrow: {
    color: '#7dd3fc',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    color: '#f8fafc',
    fontSize: 34,
    fontWeight: '800',
  },
  subtitle: {
    color: '#cbd5e1',
    fontSize: 16,
    lineHeight: 24,
  },
  heroCard: {
    backgroundColor: '#111833',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1e2a52',
    gap: 8,
  },
  heroLabel: {
    color: '#7dd3fc',
    fontWeight: '700',
    fontSize: 14,
  },
  heroMission: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 30,
  },
  heroHint: {
    color: '#94a3b8',
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    backgroundColor: '#0f172a',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    gap: 10,
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '700',
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  topicBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicBadgeText: {
    color: '#fff',
    fontWeight: '800',
  },
  topicTextWrap: {
    flex: 1,
  },
  topicTitle: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '700',
  },
  topicSubtitle: {
    color: '#94a3b8',
    fontSize: 13,
  },
  bullet: {
    color: '#cbd5e1',
    fontSize: 15,
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: '#38bdf8',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#082f49',
    fontSize: 16,
    fontWeight: '800',
  },
  progressText: {
    color: '#cbd5e1',
    fontSize: 14,
  },
  progressBarBg: {
    width: '100%',
    height: 10,
    backgroundColor: '#1e293b',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#38bdf8',
    borderRadius: 999,
  },
  quizCard: {
    backgroundColor: '#111833',
    borderRadius: 20,
    padding: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: '#1e2a52',
  },
  quizMeta: {
    color: '#7dd3fc',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  quizQuestion: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 30,
  },
  choiceButton: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#24314f',
    padding: 14,
  },
  choiceButtonActive: {
    borderColor: '#38bdf8',
    backgroundColor: '#082f49',
  },
  choiceText: {
    color: '#e2e8f0',
    fontSize: 15,
    lineHeight: 22,
  },
  choiceTextActive: {
    color: '#e0f2fe',
    fontWeight: '700',
  },
  explanationCard: {
    backgroundColor: '#172036',
    borderRadius: 16,
    padding: 16,
    gap: 6,
  },
  explanationTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
  },
  explanationText: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 21,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
});
